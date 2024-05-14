import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SharedService } from '../shared.service';
import { ValueFilterFunc } from '../core.interface';
import { Core } from '../core.static';

@Pipe({name: 'eagnaTest'})
export class EagnaTestPipe implements PipeTransform {
  transform(value: string): string { //, ...args: any[]
    return value + ' - eagna 0.0.1 test pipe';
  }
}

@Pipe({ name: 'plural' })
export class CustomPluralPipe implements PipeTransform {
  transform(input: number, customPluralForm: {singular?: string, plural: string} = {plural: 's'} ): string {
    return input > 1 ? customPluralForm.plural : (customPluralForm.singular || "");
  }
}

@Pipe( {name: 'isNotEmpty'} )
export class IsNotEmptyPipe implements PipeTransform {
  transform(value: any): boolean{
    let isValueNotEmpty = !!value;
    try {
      // console.log(1)
        if(!isValueNotEmpty && parseInt(value) >= 0){
            isValueNotEmpty = true;
        }
    } catch (error) {
      // console.log(2)
        console.warn("parseInt error", value);
    }

    if(!(value instanceof Date)){
      if(value && ((Array.isArray(value) && value.length == 0) || (typeof value == "object" && Object.keys(value).length == 0))){
        // console.log(3)
        isValueNotEmpty = false;
      } else if(value && typeof value ==  'string' && value == "undefined"){
        // console.log(4)
        isValueNotEmpty = false;
      }
    }
    // console.log(5, isValueNotEmpty)
    return isValueNotEmpty;
  }
}

/* get Initials of Name */
@Pipe({
  name: 'getInitials'
})
export class GetInitialsPipe implements PipeTransform {
  transform(value: string, limit?: number, splitter: string[] = []): string { //TODO, repeat for splitter instead of replacing
    let _toReturn = '';
    if(value){
      const _splitter = splitter.concat(' ');
      let _firstReplace = false;
      for (const _s of _splitter) {
          if (!_firstReplace && ((value.includes(_s) && value.split(_s)?.[1] !== 'com') || _s == ' ')) {
              value = value.split(_s).map((x, _i) => {
                  if(_s == ' ' || _i <= 1){
                      return (x[0] || '').toUpperCase() + x?.substring(1).toLowerCase()
                  } else{
                      return x?.toLowerCase()
                  }

              }).join(_s);
              _firstReplace = true;
          }
      }
      _toReturn = value.replace(new RegExp('[a-z'+ splitter.join('') +']', 'g'), '');
      if (limit) {
          return _toReturn.substring(0, limit);
      } else {
          return _toReturn;
      }
    }
    return _toReturn;
  }
}

@Pipe({
  name: 'abstractToFormControl'
})
export class AbstractToFormControlPipe implements PipeTransform{
  transform(value: AbstractControl | null, ...args: any[]): UntypedFormControl {
      const ctrl = value as UntypedFormControl;
      return ctrl;
  }
}

@Pipe({
  name: 'abstractToFormArray'
})
export class AbstractToFormArrayPipe implements PipeTransform{
  transform(value: AbstractControl | null, ...args: any[]): UntypedFormArray {
      const ctrl = value as UntypedFormArray;
      return ctrl;
  }
}

/* @Pipe({ name: "jsonDebug" })
export class JsonDebugPipe implements PipeTransform{
    constructor(private _jsonPipe: JsonPipe, private _sharedService: SharedService) {}
    transform(value: any): any {
      if(!this._sharedService.appConfig?.env?.main?.isProd === true){
        return this._jsonPipe.transform(value);
      }
      return "";
    }
} */

/* FilterBy Pipe */
@Pipe({ name: "filterBy", pure : false })
export class FilterByPipe implements PipeTransform
{
    constructor(private _isNotEmptyPipe: IsNotEmptyPipe) { }
    //TODO: field and value to be array, or accept operrators in comparing
    transform(arr: any[], byField: { field?: string, value: ValueFilterFunc | any, searchType?: 'anywhere' | 'start' | 'end'}): any[] {
      let byVal: any;
      let isNegation = false;
      if(typeof byField.value == 'boolean'){
        byVal = (byField.value == true);
      } else if(typeof byField.value == 'string'){
        byVal = (byField.value || '').trim();
        isNegation = byVal.startsWith("!");
        if(isNegation){
          byVal = byVal.substr(1);
        }
      }
      if (arr && arr.length > 0) {
        return arr.filter(a => {
          const aValue = !byField.field ? a : a[byField.field];
          let filterResult = false;
          if(byVal == "!empty"){
            filterResult = this._isNotEmptyPipe.transform(aValue);
          } else if(byVal == "empty"){
            filterResult = !this._isNotEmptyPipe.transform(aValue);
          } else if(typeof byField.value == "function"){
            filterResult = byField.value(aValue)
          } else if(typeof byField.value != 'boolean' && !byVal){
            filterResult = true;
          } else{
            if(!byField.field){
              filterResult = (aValue == byVal);
            } else{
              if(byField.searchType){
                switch(byField.searchType){
                  case "anywhere":
                    if(Array.isArray(aValue)){ //in case of array
                      filterResult = aValue.includes(byVal);
                    } else {
                      filterResult = (aValue as string).toLowerCase().indexOf(byVal.toLowerCase()) >= 0;
                    }
                    break; //?
                    /** falls through ?? */
                  case "start":
                    filterResult = (aValue as string).toLowerCase().startsWith(byVal.toLowerCase());
                    break; //?
                    /* falls through ?? */
                  case "end":
                    filterResult = (aValue as string).toLowerCase().endsWith(byVal.toLowerCase());
                }
                filterResult = true;
              } else{
                //means exact match or in Array
                if(Array.isArray(aValue)){
                  filterResult = aValue.includes(byVal);
                } else {
                  filterResult = (aValue == byVal);
                }
              }
            }
          }
          if(isNegation){
            return !filterResult;
          }
          return filterResult;
        });
      }
      return arr;
    }
}

/* IncludeBy Pipe */
@Pipe({ name: "includeBy", pure : false })
export class IncludeByPipe implements PipeTransform
{
    constructor() { }
    transform(arr: any[], byField: { field: string, value: any, searchType?: 'anywhere' | 'start' | 'end'}): any[] {
      if (arr && arr.length > 0) {
        return arr.filter(a => {
          return a[byField.field].includes(byField.value)
        });
      }
      return arr;
    }
}

/* IncludeBy Pipe */
@Pipe({ name: "excludeBy", pure : false })
export class ExcludeByPipe implements PipeTransform
{
    constructor() { }
    transform(arr: any[], byField: { field: string, value: any, searchType?: 'anywhere' | 'start' | 'end'}): any[] {
      if (arr && arr.length > 0) {
        return arr.filter(a => {
          return !a[byField.field].includes(byField.value)
        });
      }
      return arr;
    }
}

@Pipe({name: 'filterUnique'})
export class FilterUnique implements PipeTransform{
  transform(arrayValues: any[]) {
    return arrayValues.filter((_val: any, _index: number, _arr: any[]) => _arr.indexOf(_val) === _index);
  }
}

/* Search Highlight Pipe */
@Pipe({ name: 'highlight' })
export class HighlightSearchPipe implements PipeTransform{
    constructor(private sanitizer: DomSanitizer){}
    transform(elemText: string, searchTerms: string,type?:string): SafeHtml {
        if (!searchTerms || !elemText) {
        return elemText;
        }
        elemText = elemText.toString();
        let searchWords = searchTerms.split(" ");
        let regexTermsToMatch="";
        let reservedTerms = ['*','.',""];
        for(let word in searchWords){ //'Pipify search terms' ex 'apple jelly' -> 'apple|jelly' [to generate Regex]

        if(searchWords[word].length > 1 && reservedTerms.indexOf(searchWords[word]) == -1){
            regexTermsToMatch = "(?<!<)"+regexTermsToMatch+searchWords[word]+"(?!>)|";
        }
        }
        regexTermsToMatch = regexTermsToMatch.trim()

        let highlightText=elemText;
        if(regexTermsToMatch != ''){
        let r = new RegExp('(' + regexTermsToMatch.slice(0, -1) + ')', 'gi'); //'Search' with case-insensitive agains all terms
        let elemMatch = elemText.match(r);
        if( elemMatch != null){
            let allMatches = [... new Set( elemMatch ) ]; //Get the unique matches (Case Sensitive) as an array. Ex. ['Apple','apple','jelly']
            for (let item in allMatches) {
                if(allMatches[item] != ''){
                let ignore="";
                let index = '<mark>'.indexOf(allMatches[item]);
                if( index != -1 ){
                    //In case search term is substring of <html> wrapper for styling, append Regex to ignore.
                    //Ex. SearchTerm = ['ar'] -> Regex: "(!?ark>)ar"
                    //i.e. Match all subwords starting with 'ar' as long as it's not 'ark>'
                    //Applies to all substrings of '<mark>' [m, ma, mar, ark, rk, k ...] (Match all 'k' as long as it's not 'k>')
                    ignore = ignore+ "(?!"+ "<mark>".substr(index) +")";
                }
                let toReplace = new RegExp(ignore+allMatches[item], 'g');
                //Apply markup (Case Sebsutive)
                highlightText = highlightText.replace(toReplace,  "<mark>" + allMatches[item] + "</mark>");
                }
            }
        }else if (type=="tree"){
            highlightText = "<span style='opacity:0.5;'>"+highlightText+"</span>";
        }
    }
        // Match in a case insensitive manner
        return this.sanitizer.bypassSecurityTrustHtml(highlightText);
    }
}

/* Auto Complete Highlight Pipe */
@Pipe({ name: 'autoCompleteHighlight' })
export class AutoCompleteHighlightPipe implements PipeTransform
{
    constructor(){}
    transform(value: any, args: any): any {
        if (!args)
        {
          return value;
        } else {
          args = (typeof args == "string")?args.replace('*',''):args;
          var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
          return (value + '').replace(re, "<b>$&</b>");
        }

    }
}

/* String Replace All Pipe */
@Pipe({ name: 'replaceAll' })
export class ReplaceAllPipe implements PipeTransform{
    constructor(){}
    transform(value: string, from: string, to: string, isCaseSensitive = false): any {
      if (!from || !to){
        return value;
      } else {
        var re = new RegExp(from, 'g' + (!isCaseSensitive ? 'i' : '')); //'gi' for case insensitive.
        return (value + '').replace(re, to);
    }
  }
}

@Pipe({name: 'translateField'})
export class TranslateFieldPipe implements PipeTransform {
  constructor(private _capitalizeFirst: CapitalizeFirstPipe){}
  transform (input: string, keyword='translations'): any {
    const _trans = Core.Localize(input, {item: ''});
    return _trans == `{${keyword}.${input}}` ? this._capitalizeFirst.transform(input) : _trans;
  }
}


@Pipe({name: 'pluck'})
export class PluckPipe implements PipeTransform {
  transform (input: any[], key: string, delimeter?: string): any {
      return input.map(value => delimeter ? ((value[key] || '') + delimeter) : value[key]);
  }
}

/* Quick Filter Pipe */
@Pipe({ name: 'quickFilter' })
export class QuickFilterPipe implements PipeTransform
{
    recursiveMatch(val:any,filter:string): any {
        if(Array.isArray(val)){
        return val.some((each)=>{return this.recursiveMatch(each,filter)});
        } else if (!(typeof val === "string") && !(typeof val ==="number")){
        return Object.values(val).some((each)=>{return this.recursiveMatch(each,filter)});
        }else{
        if(new RegExp(filter,'gi').test(val.toString())){
        }
        return new RegExp(filter,'gi').test(val.toString());
        }
    }

    transform(items: any, filter: any): any {
        if (filter && Array.isArray(items)) {
            return items.filter(item => {
                return Object.values(item).some((each)=>{return this.recursiveMatch(each,filter)})
            });

        } else {
        return items;
        }
    }
}

/* Capitalize Pipe */
@Pipe({ name: "capitalizeFirst" })
export class CapitalizeFirstPipe implements PipeTransform
{
    constructor(private titleCase: TitleCasePipe) {}
    transform(title: string): string
    {
      if (title != null) {
        return this.titleCase.transform(
          title.replace(/_/g, " ").replace(/.png|.jpg/g, "")
        );
      }
      return title;
    }
}

/* merge object Pipe */
@Pipe({ name: 'mergeTo' })
export class MergeToPipe implements PipeTransform
{
    constructor(){}
    transform(obj1: any, obj2: any): any
    {
      return {...obj1, ...obj2};
    }
}

/* flatMap array Pipe */
@Pipe({ name: 'flatMap' })
export class FlatMapPipe implements PipeTransform
{
    constructor(){}
    transform(obj1: any[]): any
    {
      return (obj1 as any[]).flatMap(f => f);
    }
}

@Pipe({ name: 'objToArray' })
export class ObjToArrayPipe implements PipeTransform
{
    constructor(){}
    transform(obj: any): {label: string, value: any}[]{
      let _toReturn: {label: string, value: any}[] = [];
      if(obj && typeof obj == "object" && Object.keys(obj).length > 0){
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            _toReturn.push({label: key, value: element})
          }
        }
      }
      return _toReturn;
    }
}

@Pipe({ name: 'arrayToObj' })
export class ArrayToObjPipe implements PipeTransform
{
    constructor(){}
    transform(objArr: any[], byId?: string): {[p: string]: any} | undefined{
      let _toReturn: {[p: string]: any} | undefined = undefined;
      if(objArr.length > 0){
        _toReturn = {};
        for (const element of objArr) {
          if(byId){
            if(element && element[byId] && (typeof element[byId] == "string")){
              _toReturn[element[byId]] = element;
            }
          } else { //get the first field and the vlaue of that key
            const _firstKey = Object.keys(element)?.[0];
            if(_firstKey){
              _toReturn[_firstKey] = element[_firstKey];
            }
          }
        }
      }
      return _toReturn;
    }
}
