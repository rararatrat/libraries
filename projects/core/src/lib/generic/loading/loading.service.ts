import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription, Observable, throwError } from "rxjs";
import { distinctUntilChanged, debounceTime, take, catchError } from "rxjs/operators";

export type Key = string | object | symbol;

export interface IGetLoadingOptions {
  /** Which loading "thing" do you want to track? */
  key?: Key;
}

export interface IAddLoadingOptions {
  /** Used to track the loading of different things */
  key?: Key | Key[];
  /**
   * The first time you call IsLoadingService#add() with
   * the "unique" option, it's the same as without it.
   * The second time you call add() with the "unique" option,
   * the IsLoadingService will see if
   * an active loading indicator with the same "unique" ID
   * already exists.
   * If it does, it will remove that indicator and replace
   * it with this one (ensuring that calling add() with a
   * unique key multiple times in a row only adds a single
   * loading indicator to the stack). Example:
   *
   * ```ts
   * this.isLoadingService.isLoading(); // false
   * this.isLoadingService.add({ unique: 'test' });
   * this.isLoadingService.add({ unique: 'test' });
   * this.isLoadingService.isLoading(); // true
   * this.isLoadingService.remove();
   * this.isLoadingService.isLoading(); // false
   * ```
   */
  unique?: Key;
}

export interface IRemoveLoadingOptions {
  key?: Key | Key[];
}

class LoadingToken<T> {
  constructor(private value: T, private unique?: Key) { }

  isSame(a: unknown, unique?: Key): boolean {
    if (a === this.value) return true;
    if (this.unique && unique && this.unique === unique) return true;
    return false;
  }
}

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  protected defaultKey = "default";
  public errorMessage: any;
  // provides an observable indicating if a particular key is loading
  private loadingSubjects = new Map<Key, BehaviorSubject<boolean>>();
  public isSetLoading$ = new BehaviorSubject<boolean>(false);

  // tracks how many "things" are loading for each key
  private loadingStacks = new Map<
    Key,
    LoadingToken<true | Subscription | Promise<unknown>>[]
  >();

  // tracks which keys are being watched so that unused keys
  // can be deleted/garbage collected.
  private loadingKeyIndex = new Map<Key, number>();

  constructor() { }

  isLoading$(args: IGetLoadingOptions = {}): Observable<boolean> {
    const keys = this.normalizeKeys(args.key);

    return new Observable<boolean>((observer) => {
      // this function will called each time this
      // Observable is subscribed to.
      this.indexKeys(keys);

      const subscription = this.loadingSubjects
        .get(keys[0])!
        .pipe(distinctUntilChanged(), debounceTime(10), distinctUntilChanged(), catchError(error => {
          return throwError(error);     //return from(['A','B','C'])
        }))
        .subscribe(observer);

      // the return value is the teardown function,
      // which will be invoked when the new
      // Observable is unsubscribed from.
      return () => {
        subscription.unsubscribe();
        keys.forEach((key) => this.deIndexKey(key));
      };
    });
  }

  /**
   * Same as `isLoading$()` except a boolean is returned,
   * rather than an observable.
   *
   * @param args.key optionally specify the key to check
   */
  isLoading(args: IGetLoadingOptions = {}): boolean {
    const key = this.normalizeKeys(args.key)[0];
    const obs = this.loadingSubjects.get(key);

    return (obs && obs.value) || false;
  }

  setLoading(observable: Observable<any>, key: any) {
    const tempKey = (key) ? key : "__static__";
    if (observable !== undefined) {
      this.add(observable, { key: tempKey });

      observable.subscribe(
        res => { },
        err => { this.remove({ key: tempKey }, undefined, 'temp'); this.errorMessage = err; },
        () => this.remove({ key: tempKey })
      );
    }

  }

  add(): void;
  add(options: IAddLoadingOptions): void;
  add<T extends Subscription | Promise<unknown> | Observable<unknown>>(
    sub: T,
    options?: IAddLoadingOptions
  ): T;
  add(
    a?: Subscription | Promise<unknown> | IAddLoadingOptions,
    b?: IAddLoadingOptions
  ) {
    let options = b;
    let sub: Subscription | Promise<unknown> | undefined;
    const teardown = () => this.remove(sub!, options);

    if (a instanceof Subscription) {
      sub = a;

      if (sub.closed) return a;

      sub.add(teardown);
    } else if (a instanceof Promise) {
      sub = a;

      // If the promise is already resolved, this executes syncronously
      sub.then(teardown, teardown);
    } else if (a instanceof Observable) {
      sub = a.pipe(take(1)).subscribe();

      if (sub.closed) return a;

      sub.add(teardown);
    } else if (a) {
      options = a;
    }

    const keys = this.normalizeKeys(options?.key);

    this.indexKeys(keys);

    for (const key of keys) {
      const loadingStack = this.loadingStacks.get(key)!;

      // if the "unique" option is present, remove any existing
      // loading idicators with the same "unique" value
      if (options?.unique) {
        const index = loadingStack.findIndex((t) =>
          t.isSame(sub || true, options?.unique)
        );

        if (index >= 0) {
          loadingStack.splice(index, 1);
        }
      }

      loadingStack.push(new LoadingToken(sub || true, options?.unique));

      this.updateLoadingStatus(key);
    }

    return a instanceof Observable ? a : sub;
  }

  /*  remove(): void;
     remove(options: IRemoveLoadingOptions, param?): void;
    remove(
      sub: Subscription | Promise<unknown>,
      options?: IRemoveLoadingOptions
    ): void; */
  remove(
    a?: Subscription | Promise<unknown> | IRemoveLoadingOptions,
    b?: IRemoveLoadingOptions,
    param?: any
  ) {
    let options = b;
    let sub: Subscription | Promise<unknown> | undefined;

    if (a instanceof Subscription) {
      sub = a;
    } else if (a instanceof Promise) {
      sub = a;
    } else if (a) {
      options = a;
    }

    const keys = this.normalizeKeys(options?.key);

    for (const key of keys) {
      const loadingStack = this.loadingStacks.get(key);

      // !loadingStack means that a user has called remove() needlessly
      if (!loadingStack) return;

      const index = loadingStack.findIndex((t) => t.isSame(sub || true));

      this._updateLoadingStatus(key, param);

      if (index >= 0) {
        loadingStack.splice(index, 1);

        this.deIndexKey(key);
      }
    }
  }



  private normalizeKeys(key?: Key | Key[]): Key[] {
    if (!key) key = [this.defaultKey];
    else if (!Array.isArray(key)) key = [key];
    return key as Key[];
  }

  private indexKeys(keys: Key[]) {
    for (const key of keys) {
      if (this.loadingKeyIndex.has(key)) {
        const curr = this.loadingKeyIndex.get(key)!;
        this.loadingKeyIndex.set(key, curr + 1);
      } else {
        const subject = new BehaviorSubject(false);

        this.loadingKeyIndex.set(key, 1);
        this.loadingSubjects.set(key, subject);
        this.loadingStacks.set(key, []);
      }
    }
  }

  private deIndexKey(key: Key) {
    const curr = this.loadingKeyIndex.get(key)!;

    if (curr === 1) {
      this.loadingKeyIndex.delete(key);
      this.loadingSubjects.delete(key);
      this.loadingStacks.delete(key);
    } else {
      this.loadingKeyIndex.set(key, curr - 1);
    }
  }

  private updateLoadingStatus(key: Key) {
    const loadingStatus = this.loadingStacks.get(key)!.length > 0;

    this.loadingSubjects.get(key)!.next(loadingStatus);
  }

  private _updateLoadingStatus(key: Key, param?: any) {

    const loadingStatus = this.loadingStacks.get(key)!.length > 0;
    const tempStatus = (param == 'temp') ? null : loadingStatus;
    this.loadingSubjects.get(key)!.next(Boolean(tempStatus));
  }
}

