import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ISideBar, MenuSideBarSettings } from './sidebar.interface';



@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  constructor() { }

  public sidebarSettings$!: BehaviorSubject<MenuSideBarSettings>;

  public sidebarLoaderId!: string;

  public sidebar$ : BehaviorSubject<ISideBar> = new BehaviorSubject<ISideBar>({
    items: [],
    isVisible: true,
    sidebarLoaderId: undefined,
    mode: "compact"
  });

}
