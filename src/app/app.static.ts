import { MenuItem } from "primeng/api";
import { getLocaleType } from "projects/core/src/public-api";

export class App{
    static Localize: {[key: string]: getLocaleType} = {
        "appLocalizeComplex": {value: 'App Localize Complex', arrayKeys: ["appLocalizeComplex"]},
        "appLocalizeComplex2": {value: 'App Localize Complex 2 {interpolation1} and {interpolation2}', interpolateParams: () => ({interpolation1: '', interpolation2: ''})},
        "tests-none": {value: "Tests None"},
        "gridServerSide": {value: "Grid Server Side"},
        "search": {value: "Search"},
        "globalHeader": {value: "Today is: {dateToday}", interpolateParams: ()=>({dateToday: ''})},
        "dashboard": {value: "Dashboard"},
        "lazy": {value: "Lazy"},
        "applications": {value: "Applications"},
        "usersMngt": {value: "Users Management"},
        "tests": {value: "Tests"},
        "configs": {value: "Configurations"},
        "gridContextView": {value: "View Item"},
        "interpolation1": {value: "Hello, World! {normalVariable}", interpolateParams: ()=>({normalVariable: ''})},
        "interpolation2": {value: "String To Translate {translateVariable}", interpolateParams: ()=>({translateVariable: ''})},
        "helloNgx": {value: "Hello i18n!"},
        "dont": {value: "I don't output any element"},
        "angularLogo": {value: "Angular logo"},
        "meaningAndDescription": {value: "Meaning and Description Hello i18n!"},
        "helloHello": {value: "Hello hello"},
        "process": {value: "Process"},
        "varName": {value: "Variable Name"},
        "helloWorld": {value: "Hello, World!"},
        "var1":{value:  "{var1_name} is not right", interpolateParams: () => ({var1_name: ''})},
        "var2Name": {value: "This is Variable1 {var2_name}", interpolateParams: () => ({var2_name: ''})},
        "var2": {value: "This is Variable2"},
        "var3": {value: "This is Variable3 {placeholder_name}", interpolateParams: () => ({placeholder_name: ''})},
        "helloNgxExtra": {value: "Hello i18n! akjsdaksjd"},
        //grid columns sample
        "athlete": {value: "Athlete"},
        "country": {value: "Country"},
        "year": {value: "Year"},
        "sport": {value: "Sport"},
        "gold": {value: "Gold"},
        "silver": {value: "Silver"},
        "bronze": {value: "Bronze"},
        //
        "autoCompleteSync": {value: "AutoComplete with Synchronous Data"},
        "autoCompleteAsync": {value: "AutoComplete with Asynchronous Data"},
        "autoCompleteNonStrict": {value: "AutoComplete non-Strict"},
        "uniqueCaseSensitive": {value: "Unique Case Sensitive"},
        "requiredWhenEditable": {value: "Required when Editable Date is not empty"},

        "gridMenuDesc": {value: "To call the grid"},
        "lazyLoadingComponent": {value: "Lazy Loading Component"},
        "dashboardMenuDesc": {value: "This is a simple Dashboard"},
        "appsMenuDesc": {value: "This is a simple application"},
        "usersMenuDesc": {value: "Simple settings header"},
        "imALazyChild": {value: "I'm a Lazy Child"},
        "anotherLazyChild": {value: "Another Lazy Child", interpolateParams: ()=>({})},
    }


    public static items : MenuItem[] = [
      {
        label: 'Grid',
        icon: 'pi pi-fw pi-plus',
        routerLink: ['translations'],
        items: [
          {
            label: 'Client Side',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              {
                label: 'Row Data',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['grid-client-side-row-data']
              },
              {
                label: 'Row Data Async',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['grid-client-side-row-data-async']
              },
              {
                label: 'With ApiCall Params',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['grid-client-side-api-call-params']
              },
            ]
          },
          {
            label: 'Server Side',
            icon: 'pi pi-fw pi-video',
            routerLink: ['grid-server-side']
          }
        ]
      },
      {
        separator: true
      },

      {
        label: 'Translations',
        icon: 'pi pi-fw pi-trash',
        routerLink: ['translations']
      },

    ];



}
