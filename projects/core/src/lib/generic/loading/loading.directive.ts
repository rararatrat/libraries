import { Directive, Input, ComponentFactory, ComponentRef, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Inject, ViewChild, SimpleChanges, OnChanges, OnDestroy, AfterViewInit } from "@angular/core";

import { Subscription, Observable } from "rxjs";

import { catchError } from "rxjs/operators";

import { LoadingService } from "./loading.service";
import { LoadingComponent } from "./loading.component";
import { ErrorComponent } from "../error/error.component";

  @Directive({
    selector: '[apploading]'
  })
  export class LoadingDirective implements AfterViewInit, OnDestroy {

    public loadingComponent : ComponentRef<LoadingComponent> | undefined;
    public errorComponent   : ComponentRef<ErrorComponent> | undefined;

    private _inputValue : any;
    private _subscription = new Subscription();
    loadingFactory: any;
    errorFactory: any;

    constructor ( private _isLoadingService: LoadingService,
      private templateRef: TemplateRef<any>,
      private vcRef: ViewContainerRef,
      private componentFactoryResolver: ComponentFactoryResolver){
        this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
        this.errorFactory   = this.componentFactoryResolver.resolveComponentFactory(ErrorComponent);
      }

    @Input() refId = '';

    @Input() set apploading(value: unknown) {
      this._inputValue = value;

      if (typeof this._inputValue === 'boolean')
      {
        this.vcRef.clear();
        this._directiveLoader(this._inputValue);
      }
      else if (typeof this._inputValue === 'object')
      {
        if(this._inputValue instanceof Observable)
        {
          this._isLoadingService?.setLoading(this._inputValue, '__static__');
          this._subscription.add(this._isLoadingService?.isLoading$({key: '__static__'}).subscribe({
            next: (res) =>  {
                        this.vcRef.clear();
                        this._directiveLoader(res);
                      },
            error: (error) =>  {
                        this.vcRef.clear();
                      }
          }));
        } else if(this._inputValue?.value === true){
          this.vcRef.clear();
          this._directiveLoader(this._inputValue?.value);
        } else {
          this._isLoadingService.setLoading(this._inputValue?.value, this._inputValue?.key);
          this._subscription.add(this._isLoadingService.isLoading$({key: this._inputValue?.key}).subscribe({
            next: (res: any)   =>  {
                        this.vcRef.clear();
                        this._directiveLoader(res);
                      },
            error: (err) =>  {
                        catchError(err);
                        this._directiveLoader(null);

                      }}
          ));
        }
      }
    }

    private _directiveLoader(loading:any){
      //console.trace({loading});
      switch(loading){
        case true:
            //console.trace("true", {_directiveLoader: loading});
            this.loadingComponent = this.vcRef.createComponent(this.loadingFactory);
            if(typeof this._inputValue !== 'boolean')
            {
              this.loadingComponent.instance.message = (!("message" in this._inputValue))? this.loadingComponent.instance.message: this._inputValue?.message;
              this.loadingComponent.instance.style = (!("style" in this._inputValue))? this.loadingComponent.instance.style: this._inputValue?.style;
              this.loadingComponent.instance.type = (!("type" in this._inputValue))? this.loadingComponent.instance.type: this._inputValue?.type;
              this.loadingComponent.instance.image = (!("image" in this._inputValue))? "assets/img/eg_rd_black.png": this._inputValue?.image;
            }
          break;
        case null:
        case false:
            //console.trace("null false", {_directiveLoader: loading, inputValue: this._inputValue});
            if(loading === false){
              if(typeof this._inputValue !== 'boolean'){
                if(this._isLoadingService.errorMessage){
                  //setTimeout(() => {
                    if(!this.refId || this.refId == this._inputValue?.key){
                      this.errorComponent = this.vcRef.createComponent(this.errorFactory);
                      this.errorComponent.instance.errorMessage = this._isLoadingService.errorMessage;
                    }
                  //})
                } else{
                  this.vcRef.createEmbeddedView(this.templateRef);
                }
              } else {
                this.vcRef.createEmbeddedView(this.templateRef);
              }
            } else {
              this.errorComponent = this.vcRef.createComponent(this.errorFactory);
              if(typeof this._inputValue !== 'boolean')
              {
                this.errorComponent.instance.errorMessage = this._isLoadingService.errorMessage;
              }
            }
          break;
        default:
          //console.trace("default", {_directiveLoader: loading});
          this.vcRef.createEmbeddedView(this.templateRef);
          break;
      }
    }

    ngOnDestroy(): void {
      this._subscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
    }
  }
