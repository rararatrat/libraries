import { Observable } from "rxjs";
import { agThemeType, GridPeferences } from "./grids/grid.interface";
/* import { panelType, sideBarMode } from "./navigation/side-bar/side-bar.interface"; */
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { InjectionToken } from "@angular/core";

export const APP_ID: InjectionToken<number> = new InjectionToken<number>("1");
export const ComponentLookupRegistry: Map<string, any> = new Map();
export const ComponentLookup = (key: string): any => {
    return (cls: any) => {
        ComponentLookupRegistry.set(key, cls);
    };
};
export type apiMethod = 'post' | 'get' | 'put' | 'patch' | 'delete' | 'options' | 'copy' | 'head' | 'link' | 'unlink' | 'purge' | 'lock' | 'unlock' | 'propfind' | 'view' | 'email' | undefined;
export type onOff = {on: string, off: string};
export type snackBarExtraButtons = {label: string, class?: string, callback: (p?: any)=>void};
export type notifColors = "success" | "danger" | "warn" | "primary" | "info";
export type envAppConfig = {apiUrl: string, isProd: boolean, isDebug: boolean, hideConsoleLog: boolean};
export type schemeType = 'dark' | 'light' | 'auto';

export function getElementValue(obj: any, attr: string, params?: any): any{
    if(obj && obj[attr]){
        if(typeof(obj[attr]) == "function"){
            return obj[attr](params);
        } else{
            return obj[attr];
        }
    }
    return null;
}

/* export type localeTypeComplex = {value: string, arrayKeys?: string[], interpolateParams?: Object};
export type getLocaleType = (string | localeTypeComplex); */
export type getLocaleType = {value: string, arrayKeys?: Array<string>, interpolateParams?: () => Object, processInterPolation?: (params: Object) => string} | undefined;

export interface AnyPropertyFunc {
    (params?: any): any;
}

export interface StringPropertyFunc {
    (params?: any): string;
}

export interface NumberPropertyFunc {
    (params?: any): number;
}

export interface BooleanPropertyFunc {
    (params?: any): boolean;
}

export interface ArrayAnyPropertyFunc {
    (params?: any): any[];
}

export interface ArrayStringPropertyFunc {
    (params?: any): string[];
}

export interface ArrayNumberPropertyFunc {
    (params?: any): number[];
}

export interface ArrayBooleanPropertyFunc {
    (params?: any): boolean[];
}

export interface ApiCallParams {
    /* RT eagna commented
    disableLoader?: boolean;
    disableProgress?: boolean; */
    params?: any;
    next?:any;
    previous?:any;
    api(params?: any, method?:any, nexturl?:any): Observable<any>;
    callback?(result?: any, p?: any): void;
    failCallback?(e?: any, p?: any): void;
    executeAfterCallback?(result?: any, params?: any): void; // this is very rare, when a callback is not set at the beginning and overridden.
    executeAfterFailCallback?(e?: any, p?: any): void;
    finally?(p?: any): void;
}

export interface OptionsAsyncParams{
    api: (params: any) => Observable<any>,
    params: any,
    mapFn?: (result: any, currentValue?: any) => any[],
    requiresQuery?: boolean
}

/* export interface UserSideBar{
    menuType: panelType;
    sidebarVisible: boolean;
    mode: sideBarMode;
    modal: boolean;

    //backend alignment
    id?: number;
    appId?: number;
    sidebarId?: string;
} */

export type userPrefType = 'locale' | 'am' | 'gridPref' | 'gridTheme' | 'sidebar' | 'darkMode' | undefined;

export interface AppPreferences{
    ui_theme: 'dark' | 'light' | 'auto';

    //backend alignment
    appId: number;
    app_name: string;
    userId?: number;
    id?: number;

    /* //temp
    sidebar?: {[p: string]: UserSideBar};
    grid?: GridPeferences[]; //TODO convert to object
    am?: amThemeType[]; //TODO convert to object */
}

export interface UserPreferences {
    app: AppPreferences[];
    sidebar?: {[p: string]: any /* UserSideBar */};
    grid?:  {[p: string]: GridPeferences};
    locale: string;
    changeType?: {type: userPrefType, value?: any}
}

export interface ValueFilterFunc {
    (params?: any): boolean;
}

export interface GenericResponse{
    myProp: any;
}

export interface UserModel{
    id: number | string;
    name: string;
    email: string;
    user_pref_id?: number;
}

export interface ResponseObj<T>{
    status: {
        status_code: number,
        message: any
    },
    content: T
    response?: {
        code: number,
        message: string
    }
}

export interface ToolBarHeaderSettings{
    name: string;
    /* sideMenu?: SideMenuSettings; */
    logo?: {
        class: string,
        status: string
    };
    homeLink?: string;
    rightIcons?: {
        notif: boolean,
        apps: boolean,
        contacts: boolean,
        user: boolean
    };
}

/* RT: note, to be removed when confirm tabs from primeNg is available */
export interface TabsData {
    path?: string | StringPropertyFunc;
    icon?: string;
    label: string;
    tooltip?: string;
    iconClass?: boolean | AnyPropertyFunc;
    disabled?: boolean | BooleanPropertyFunc;
    isActive?: boolean | BooleanPropertyFunc;
    onClick?: (p: any) => void;
    hidden?: boolean | BooleanPropertyFunc;
    badgeValue?: string | StringPropertyFunc;
    visited?: boolean | BooleanPropertyFunc;
}


/* RT: note, to be removed when confirm dialog from primeNg is available */
export interface ConfirmDialogResult{
    isConfirmed: boolean;
    newDate?: any;
    token?: string;
    newValue?: string;
    customOptionData?: any;
    additionalFormData?: any;

    apiData?:any;
    rawData?:any;
}

export interface CustomDialogConfig extends DynamicDialogConfig{
    pStyleClass?: string;
    icon?: string | undefined;
    visible?: boolean | undefined;
    breakpoints?: any | undefined;
    draggable?: boolean | undefined;
    resizable?: boolean | undefined;
    //position?: 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'top-left' | 'top' | 'top-right' | '' | undefined;
    position?: "top" | "left" | "center" | "right" | "bottom" | "topleft" | "topright" | "bottomleft" | "bottomright";
    dialogType?: CONFIRM_DIALOG_TYPE;
    content: string | undefined;
    onConfirm(confirmData?: ConfirmDialogResult): void;
    onCancel?(cancelData?: ConfirmDialogResult): void;
}

export interface FormTemplate {
    key: string;
    value?: any;
    controlType: string;
    type?: "text" | "number";
    list?: any[];
    editable?: boolean;
    isDynamic?: boolean;
    toSave?: boolean;
    disabled?: boolean;

    min?: number;
    max?: number;
    minRows?: number;
    maxRows?: number;

    label?: string;
    required?: boolean;
    placeholder?: string;
    appearance?: string;
    displayKey?: string;
    valueKey?: string;
    options?: any[];
    isHidden?: boolean;
    style?: any;
    inputClass?: string;
    formClass?: any;
    emptyLabel?: string;

    optionsAsyncParams?: OptionsAsyncParams;
    requireSelection?: boolean;

    readonly?: boolean;

    filter  ?: (searchTerm: any) => any;
    //no need to set
    oldValue?: any;
}

export type taskStatus = {
    id: number,
    name: string
}

export type taskType = {
    id: number,
    name: string
}

export class TASK_TYPE{
    static byCode: {[key: string]: string} = {
        '1': 'Task Type 1',
        '2': 'Task Type 2',
        '3': 'Task Type 3',
        '4': 'Task Type 4',
        '5': 'Task Type 5'
    };

    static byName: {[key: string]: number} = {
        'Task Type 1': 1,
        'Task Type 2': 2,
        'Task Type 3': 3,
        'Task Type 4': 4,
        'Task Type 5': 5
    };
}

export class TASK_STATUS{
    static byCode: {[key: string]: string} = {
        '1': 'Status 1',
        '2': 'Status 2',
        '3': 'Status 3',
        '4': 'Status 4',
        '5': 'Status 5'
    };

    static byName: {[key: string]: number} = {
        'Status 1': 1,
        'Status 2': 2,
        'Status 3': 3,
        'Status 4': 4,
        'Status 5': 5
    };
}

export type laneType = {
    id?: number,
    name: string,
    position: number,
    isCollapsed?: boolean,
    isLocked?: boolean,
    isNew?: boolean,
    isHidden?: boolean,
}

export type laneItem = {
    id: number,
    name: string,
    laneId: number,
    position: number,
    projects?: number[],

    /* modules?: string[],
    priority?: number,
    status?: taskStatus,
    delay_driver?: any,
    owner?: number,
    requestor?: number,
    task_type?: any, */
    modules?: string[],
    priority?: number,
    status?: taskStatus,
    delay_driver?: string,
    owner?: string,
    requestor?: string,
    task_type?: any,
}

export enum CONFIRM_DIALOG_TYPE {
    YES_NO          = "yesNo",
    DATE_PICKER     = "datePicker",
    CUSTOM_OPTIONS  = "customOptions",
    TOKEN           = "confirmationToken",
    LARGE_TEXT      = "largeText",
    GENERIC         = "generic"
}

export enum MESSAGE_SEVERITY {
    ERROR           = "error",
    WARN            = "warn",
    SUCCESS         = "success"
}

export interface CustomOptionButtons {
    label           : string;
    value           : any;
    icon            ?: string;
    isButtonDefault ?: boolean; //Sets as 'mat-raised', inconsistent behaviour
    buttonColor     ?: string; // Avoid Using button colors. use classes btn btn-success.
    buttonClass     ?: any;
}

export interface IViewDetails{
    data: any;
    enableHistory?: boolean;
    modeActions?: IModeActions;
    isDebug?: boolean;
}

export interface IModeActions{
    mode: string;
    notEditable?: true | BooleanPropertyFunc;
    actions: {[mode: string]: {
        lane?: 'history' | undefined;
        label?: string;
        icon?: string;
        title?: string;
        styleClass?: string | StringPropertyFunc;
        style?: string | AnyPropertyFunc;
        callback: (p?: any) => any;
        disabled?: true | BooleanPropertyFunc;
        hide?: true | BooleanPropertyFunc;
        /*position?: "start" | "middle" | undefined; */
        }
    },
    historyCallback?: (params: any) => Observable<ResponseObj<any>>;
    contentButtonClass?: string;
}

export interface User{
    app_metadata: any[];
    blocked: boolean;
    country: string;
    created_at: string;
    date_joined: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    globalChartPref: boolean;
    globalGridPref: boolean;
    globalMenubarPref: boolean;
    globalScheme: schemeType;
    groups: any[];
    id: number;
    identities: any[];
    is_active: boolean;
    is_deactivated: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_ip: string;
    last_login: string;
    last_name: string;
    last_password_reset: string;
    locale: string;
    logins_count: number;
    multifactor: string;
    phone_number: string;
    phone_verified: boolean;
    picture: string;
    provider: string;
    updated_at: string;
    user_id: string;
    user_metadata: any[];
    user_permissions: any[];
    username: string;
  };
