import { NavigationExtras } from "@angular/router";
import { MenuItem } from "primeng/api";

export type sideBarMode = 'compact' | 'thin' | 'list';
export type panelType   = "sidebar" | "menubar";

export interface ISideBar{
  mode            : sideBarMode;
  sidebarLoaderId : string | undefined;
  items           : MenuItem[];
  isVisible       : boolean;
}

export interface MenuItems {
    icon: string;
    label: string;
    items?: MenuItem[];
    subTitle?: string;
    titleAbbr?: string;
    selected?: boolean;
    routerLink?: string[];
    navExtras?: NavigationExtras;
    class?: any;
    isDisabled?: boolean;
    command?: (event?: PointerEvent) => void;
    onClick?: (item?: MenuItem, parentIndex?: number, event?: Event) => void;
}
/** General Setting of a SideBar Menu */
export interface MenuSideBarSettings {
    menuType?: panelType;
    items: MenuItems[];
    sidebarVisible?: boolean;
    subMenuVisible?: boolean;
    selectedParentIndex?: number;
    expandedChildIndex?: number;
    denseMode?: boolean;
    mode: sideBarMode;
    modal?: boolean;
    menuHeader?: {
        icon?: string;
        label: string;
        styleClass?: any;
    };
    /** set to true to force replace the current MenuSideBarSettings, particularly on subject.next() */
    force?: boolean;
    /** set this to particulary tell the sidebar which active route is gonna be compared to
     * , the string should be matched to router's data: {sidebarLoaderId: 'new-id'}
     * , to be used during subject.next().subscription */
    sidebarLoaderId?: string;
}
