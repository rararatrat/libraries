import { Injectable, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, Params, Router } from '@angular/router';
import { filter, pairwise, startWith, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class RouteObserverService implements OnDestroy{

  public subscription = new Subscription();
  public snapshotLoaded = false;
  
  private _snapshot!: ActivatedRouteSnapshot;
  private _snapshotData!: Data;
  private _snapshotParams!: Params;

  public get snapshotParams(): Params {
    return this._snapshotParams;
  }
  public set snapshotParams(value: Params) {
    this._snapshotParams = value;
  }

  public get snapshotData(): Data {
    return this._snapshotData;
  }
  public set snapshotData(value: Data) {
    this._snapshotData = value;
  }
    
  public get snapshot(): ActivatedRouteSnapshot {
    return this._snapshot;
  }

  public set snapshot(value: ActivatedRouteSnapshot) {
    this._snapshot = value;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router){
      const _recur = (route: ActivatedRoute) => {
        if(route){
          for (const child of route.children) {
            this.snapshotData = {...this.snapshotData, ...child?.snapshot?.data};
            this.snapshotParams = {...this.snapshotParams, ...child?.snapshot?.params};
            _recur(child)
          } 
        }
      }

      try{
        this.subscription.add(this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          startWith(null),
          pairwise(),
          ).subscribe((e: any[]) => {
            this.snapshot = this.activatedRoute.snapshot;
            this.snapshotData = this.snapshot.data;
            this.snapshotParams = this.snapshot.params;
            _recur(this.activatedRoute.root);
            
            this.onRouteReady(e, this.snapshot, this.snapshotData);

            if(this.snapshotLoaded){
              setTimeout(() => {
                this.onRouteReloaded(e?.find(_e => _e instanceof NavigationEnd), this.snapshot, this.snapshotData);
              })
            }
          })
        );
      } catch(e){
          console.warn('RouteObserver error', e);
      }
      _recur(this.activatedRoute.root);
      this.snapshot = activatedRoute.snapshot;
  }

  /* ngOnInit(): void {
    this.snapshot = this.activatedRoute.snapshot;
    this.onSnapshotReady(this.snapshot);
    this._loaded = true;
  } */

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.snapshotLoaded = false;
  }

  abstract onRouteReady(event?: any[], snapshot?: ActivatedRouteSnapshot, rootData?: Data, rootParams?: Params): void;
  abstract onRouteReloaded(event?: NavigationEnd, snapshot?: ActivatedRouteSnapshot, rootData?: Data, rootParams?: Params): void;
}

