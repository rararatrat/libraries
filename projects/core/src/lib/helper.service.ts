import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiCallParams, ResponseObj } from './core.interface';
import { GridResponse } from '../lib/grids/grid.interface';
import { ArrayToObjPipe, CustomPluralPipe, GetInitialsPipe, IsNotEmptyPipe, ObjToArrayPipe } from './pipes/eagna.pipe';
import { DatePipe, DecimalPipe, formatDate, Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { deepEqual } from 'ts-deep-equal';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    private _datePipe: DatePipe,
    private _getInitials: GetInitialsPipe,
    private _plural: CustomPluralPipe,
    private _isNotEmpty: IsNotEmptyPipe,
    private _router: Router,
    private _objToArray: ObjToArrayPipe,
    private _arrToObject: ArrayToObjPipe,
    private _decimal: DecimalPipe,
    private _location: Location
  ) {}

  public toggleClass(classes: string | string[], class2: string, mode?: 'add' | 'remove'): string[] | string{
    const _index = classes.indexOf(class2);
    const _isExisting = _index >= 0;
    if(Array.isArray(classes)){
      if(mode == 'remove'){
        classes.splice(_index, 1);
      } else if(mode == 'add'){
        classes.push(class2);
      } else if(_isExisting){
        classes.splice(_index, 1);
      } else if(!_isExisting){
        classes.push(class2);
      }
    } else{
      if(mode == 'remove'){
        classes = classes.replace(class2, '');
      } else if(mode == 'add'){
        classes += ' ' + class2;
      } else if(_isExisting){
        classes = classes.replace(class2, '');
      } else if(!_isExisting){
        classes += ' ' + class2;
      }
    }
    return classes;
  }

  public arrToObj(arr: any[], byId?: string): {[field: string]: string} | undefined{
    return this._arrToObject.transform(arr, byId);
  }

  public objToArray(obj: any): {label: string, value: any}[]{
    return this._objToArray.transform(obj);
  }

  public gotoPage(params: {
    /** if empty, it will reinitialize the current component without page reload */
    pageName?: string | string[];

    /** e.g. {relativeTo: this.activatedRoute} */
    extraParams: NavigationExtras;

    /** from Event (PointerEvent) originalEvent?.ctrlKey */
    newTab?: boolean;
  }): void {
    let _loc: string | string[] = (params.pageName || this._location.path());
    if(!Array.isArray(_loc)){
      _loc = [_loc];
    }

    if(this.isNotEmpty(_loc)){
      if(params.newTab){
        let _url = this._router.serializeUrl(
          this._router.createUrlTree(_loc, params.extraParams)
        );
        //window.open('#' + _url, '_blank'); //# depends on config if is using fragment (by default yes)
        window.open(_url, '_blank'); //# depends on config if is using fragment (by default yes)
      } else{
        if(params.pageName !== undefined){
          this._router.navigate(_loc, params.extraParams);
        } else{
          this._router.navigate(['/'], {skipLocationChange: true}).then(() => {
            this._router.navigate((<string[]>_loc), params.extraParams);
          });
        }
      }
    } else{
      console.warn('no destination provided upon route change request');
    }
  }

  public gotoUrl(pageName: string): void {
    this._router.navigateByUrl(pageName);
  }

  public getInitials(value: string){
    if(value){
      return this._getInitials.transform(value);
    }else {
      return '';
    }
    
  }

  public getNumAndLetterMask(howMany: number, numericOnly = false, withAcceptableChars?: {char: string, includeAlsoFirstAndLast?: boolean}) : any[]{
    let getRegEx = (index: number) => {
      let applyChar = withAcceptableChars && (withAcceptableChars.includeAlsoFirstAndLast || (index > 0 && index < howMany-1)); //only in between character (excluding 1st and last)

      let regEx = !applyChar? /[0-9]|[a-z]|[A-Z]/ : new RegExp(`[0-9]|[a-z]|[A-Z]|${withAcceptableChars?.char}`);
      if(numericOnly){
        regEx = !applyChar? /[0-9]/ : new RegExp(`[0-9]|${withAcceptableChars?.char}`);
      }
      return regEx;
    }

    let regExs = [];

    for (let i = 0; i < howMany; i++) {
      regExs.push(getRegEx(i));
    }
    return regExs;
  }

  /* RT: TODO get new library */
  public decrypt(value: any) {
    /* let iv  = CryptoJS.enc.Utf8.parse(this._keys);
    let decrypted = CryptoJS.AES.decrypt(value, this._keys, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8); */
    return "";
  }

  /* RT: TODO get new library */
  public encrypt(value: any, keys: string){
    //let key = CryptoJS.enc.Utf8.parse(this._keys);
    /* let iv = CryptoJS.enc.Utf8.parse(keys);
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), this._keys,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString(); */
    return '';
  }

  
  public arrayFilterDistinct(toFilter: { arr: any[], byId?: string | string[], mapper?: { field: string, func?: "sum" | "diff" }[] } = {arr: []}): any[] {
    if (toFilter.byId) {
      let byIds = Array.isArray(toFilter.byId) ? toFilter.byId : [toFilter.byId];
      let filterReturn = toFilter.arr.filter((val, index, self) => {
        if (val[byIds[0]]) {
          if (self.findIndex(a => {
            let _isFound = true;
            for (let id of byIds) {
              if(a[id] !== val[id]){
                _isFound = false;
                break;
              }
            }
            return _isFound;
          }) === index) {
            if (toFilter.mapper) {
              let aggs: any = {};
              aggs[byIds[0]] = val[byIds[0]];

              toFilter.mapper.forEach(m => {

                let runAggsToThis = self.filter(f => f[byIds[0]] == val[byIds[0]]);
                if (runAggsToThis.length > 1) {
                  aggs[m.field] = runAggsToThis.reduce((total, num) => {
                    let tot = total[m.field] ? total[m.field] : total;
                    if (isNaN(tot)) {
                      tot = 0;
                    }
                    switch (m.func) {
                      case "diff": return (tot * 1) - (num[m.field] * 1);
                      default: return (tot * 1) + (num[m.field] * 1);
                    }
                  });
                } else {
                  aggs[m.field] = runAggsToThis[0][m.field];
                }
              });
              self[index].aggs = aggs;
            }
            return true;
          }
          return false;
        }
        return self.indexOf(val) === index;
      });

      if (toFilter.mapper) {
        return filterReturn.map(f => f.aggs);
      }
      return filterReturn;

    } else {
      return toFilter.arr.filter((val, index, self) => self.indexOf(val) === index);
    }
  }

  public arraySortBy(toSort: { arr: any[], byId?: string }): any[] {
    let sortFunc = (a: any, b: any) => {
      let x;
      let y;

      if(toSort.byId){
        x = a[toSort.byId];
        y = b[toSort.byId];
      } else{
        x = a;
        y = b;
      }

      if (x && y) {
        if (!isNaN((x * 1))) {
          x = parseFloat(x);
          y = parseFloat(y);
        } else {
          x = x.toLowerCase();
          y = y.toLowerCase();
        }
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
      } else if(!x){
        return -1;
      } else if(!y){
        return 1;
      }
      /* else {
        return 1;
      } */

      return 0;
    };

    return (Array.from(new Set(toSort.arr) || []).sort(sortFunc));
  }

  public arrayFilter(value: any, key: string, arrayName: any[]){
    const filterValue = (typeof value != "object") ? (value.toString()).toLowerCase() : value;
    return arrayName.filter(option => {
      if(option[key] != null){
        let tempOptKey = option[key].toString();
        return tempOptKey.toLowerCase().includes(filterValue);
      }
    });
  }

  public dateMask(show: boolean) {
    return {
      guide     : true,
      showMask  : show,
      mask      : [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
    };
  }

  public convertUTCDateToLocalDate(date: any, localeFormat?: string) {
    let lcf         = localeFormat || "en-GB";
    let newDate   = new Date(date);
    let enDate    = newDate.toLocaleDateString(lcf);
    return enDate;
  }

  public transformDate(date: any, format: string, locale?: string) {
    let whichFormat = format || 'dd/MM/yyyy';
    let whichLocale = locale || this._locale;
    return formatDate(date, whichFormat, whichLocale);
  }
  
  public pipeDate(date: any, format: string, locale: string, tz?: string, alreadyDate = false) {
    //let whichFormat = format || 'dd.MM.yyyy - HH:mm';
    let whichFormat = format || 'dd/MM/yyyy';
    let whichLocale = locale || this._locale;
    if(date != null){
      try{
        return this._datePipe.transform(date, whichFormat, tz, whichLocale);
      } catch(e){}
      //if not translated then orig logic

      if(typeof(date) == typeof('str')){
        // date = date.replaceAll('/', '-');
        date = date.replace(/\//gi,'-');

        if(alreadyDate){
          let tempDateTime = date.split(" ");
          if(tempDateTime[0]){
            let tempDate = tempDateTime[0];
            let tempTime = tempDateTime[1];
            let switchTempDate = tempDate.split("-");
            if(switchTempDate){
              date = switchTempDate[1] + "-" + switchTempDate[0] + "-" + switchTempDate[2] + (tempTime? " " + tempTime : "");
            }
          }
        }
      }
      try{
        return this._datePipe.transform(date, whichFormat, tz, whichLocale);
      } catch(e){
        console.warn(e);
        return date;
      }
      /* } 
      return date; */
    }
    return null;
  }

  pipeDecimal(num: number, locale: string, digitsInfo?: string): string{
    let _toReturn = num + '';
    try{
      _toReturn = (this._decimal.transform(num, digitsInfo, locale) || _toReturn);
    }catch(e){}

    return _toReturn;
  }

  public plural(count: number,  plural: string = 's', singular?: any){
    const customPlural:any = {plural};
    if(singular){
      customPlural.singular = singular;
    }
    return this._plural.transform(count, customPlural);
  }

  public isNotEmpty(value: any): boolean{
    return this._isNotEmpty.transform(value);
  }

  public getCircularReplacer(){
    const seen = new WeakSet();
        return (key: any, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
  }

  public toFormControl(formControlTemplate: any, value?: any) {
    let validators: any[] = [];
    let asyncValidators: any[] = [];

    if (formControlTemplate && formControlTemplate.required ==true){
      validators = validators.concat([Validators.required]);
    }
    if(formControlTemplate && formControlTemplate.customValidators != null){
      validators = validators.concat(formControlTemplate.customValidators);
    }
    if(formControlTemplate && formControlTemplate.customAsyncValidators != null){
      asyncValidators = asyncValidators.concat(formControlTemplate.customAsyncValidators);
    }

    let nfc =  new UntypedFormControl(
        {
          value: (value ||
          ((formControlTemplate && formControlTemplate.value != null)
              ? formControlTemplate.value
              : '')),
          disabled: (formControlTemplate && formControlTemplate.disabled)
        },
        validators,
        asyncValidators
      )

      return nfc;
  }

  public toFormGroup(formTemplate: any) {
    let group: any = {};

    for (var i = 0; i < formTemplate.length; i++) {
      var field = formTemplate[i];
      if(field && field.controlType == "list"){
        let fArr;
        if(field.arrayTemplate && field.arrayTemplate.length>0){
          //this is for groups in array
          fArr = field.list.map((fc: any) => {
            let grpObj: any = {};
            for (let iterator of field.arrayTemplate) {
              let validators: any[] = [];
              let asyncValidators: any[] = [];

              if (iterator.required){
                validators = validators.concat([Validators.required])
              }
              if(iterator.customValidators != null){
                validators = validators.concat(iterator.customValidators)
              }
              if(iterator.customAsyncValidators != null){
                asyncValidators = asyncValidators.concat(iterator.customAsyncValidators)
              }

              grpObj[iterator.key] = new UntypedFormControl({value: fc[iterator.key], disabled: (iterator.disabled || false)}, validators, asyncValidators);
            }

            return new UntypedFormGroup(grpObj);
          })
        } else{ //normal array
          fArr =  field.list ? field.list.map((fc: any) => {
            let nfc = this.toFormControl(field, fc);
            return nfc;
          }) : [];
        }

        group[field.key] = new UntypedFormArray(fArr);
      } else{
        group[field.key] = this.toFormControl(field);
      }
    }
    return new UntypedFormGroup(group);
  }

  public toFormData( formValue: any, isMultiple = true, ref?: string ): FormData {
    let formData = new FormData();

    let i=1;
    for ( let key of Object.keys(formValue) ) {
      let obj = formValue[key] as any;
      if(obj){
        if(obj.type == "file"){
          formData.append(isMultiple? "file[]" : "file_"+ (i++), obj.file, (ref? ref + "_" : "") + obj.file.name);
        } else{
          if(key == "file"){
            formData.append("file", obj, (ref? ref + "_" : "") + obj.name);
          } else{
            formData.append(key, obj);
          }
        }
      } else{
        formData.append(key, obj);
      }
    }
    return formData;
  }

  public fieldValue(p: {[field: string]: any}): any{
    if(p){
      return Object.keys(p)?.[0] || '';
    }
    return '';
  }
  
  public mergeArrays(destination: any[] = [], source: any[] = [], byId?: string): any[] {
    let hasNewColumn = false;
    source.forEach(s => {
        if((byId && s.hasOwnProperty(byId) && !destination.find(d => d[byId] == s[byId])) || (!byId && !destination.find(d => deepEqual(d, s)))){
            destination.push(s);
            hasNewColumn = true;
        }
    });
    return destination;
}

  public ValidationRules = {
    inValidIf : (fn: (ctrl: AbstractControl) => boolean, customError: any): ValidatorFn => {
      return (control: AbstractControl): any => {
          if(fn(control)){
              return customError;
          }
          return null;
      }
    },
    uniqueInForm: (checkOnlyChanged?: boolean, key?:string, label = "Serial number"): ValidatorFn => {
      return (control: AbstractControl): any => {
          if(control.parent != null && (!checkOnlyChanged || (checkOnlyChanged && !control.pristine))){
              let values: any[] = [];

              if(key){
                  /* (Object.keys(control?.parent?.parent?.controls) as any[]).forEach(pKey => {
                      values.push(control.parent.parent.controls[pKey].controls[key].value);
                  }); */
              } else{
                  Object.keys(control.parent.controls).forEach(key => {
                      /* values.push(control.parent.controls[key].value); */
                  });
              }

              if(values.filter((x:any)=>{ return !['',null].includes(x) && !['',null].includes(control.value) != null &&  x.toString().toLowerCase() == (control.value || '').toString().toLowerCase()}).length > 1){
                  return {isDuplicate:{message: label + " duplicated"}}
              }
          }
          return null;
      };
    }
  }

  /* public isGridResponse(obj: any): obj is GridResponse{
    return (obj && obj.hasOwnProperty('data'));
  } */

  public isResponseObj(obj: any): obj is ResponseObj<any>{
    return (obj && obj.hasOwnProperty('content'));
  }

  public isGridResponse(obj: any): obj is GridResponse{
    return obj && obj.hasOwnProperty("results") && Array.isArray(obj.results) && obj.hasOwnProperty("count") && typeof obj.count == "number";
  }

  private isArrayOf(obj: any[], whichType: any): boolean{
    return this.isNotEmpty(obj) && (Array.isArray(obj) && obj[0] && typeof obj[0] == whichType);
  }

  public isArrayOfObject(obj: any): obj is any[]{
    return this.isArrayOf(obj, "object");
  }

  public isArrayOfString(obj: any): obj is string[]{
    return this.isArrayOf(obj, "string");
  }
  public isArrayOfNumber(obj: any): obj is string[]{
    return this.isArrayOf(obj, "number");
  }

  public isApiCallParams(obj: any): obj is ApiCallParams{
    return (obj as ApiCallParams).api !== undefined;
}

  public stripHtml(html: any){
    // Create a new div element
    let temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";

    //.replace(/<[^>]*>/g, '')
  }

  public filterUnique(array: any[], byField?: string) {
    if(byField){
      return array.filter((_value: any, _index: number, _arr: any[]) => _arr.findIndex(_eachArr => _eachArr[byField] == _value[byField]) === _index);
    }
    return array.filter((_value: any, _index: number, _arr: any[]) => _arr.indexOf(_value) === _index);
  }
}
