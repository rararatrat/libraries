import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export const APP_ANGULAR_MODULE = [
	FormsModule,
	CommonModule,
	HttpClientModule
]

import { SharedModule, Header, Footer, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { FocusTrapModule } from 'primeng/focustrap';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { KnobModule } from 'primeng/knob';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { DataViewModule } from 'primeng/dataview';
/* import { GMapModule } from 'primeng/gmap'; */
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PaginatorModule } from 'primeng/paginator';
import { PickListModule } from 'primeng/picklist';
import { TimelineModule } from 'primeng/timeline';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DockModule } from 'primeng/dock';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { DragDropModule } from 'primeng/dragdrop';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BlockUIModule } from 'primeng/blockui';
/* import { CaptchaModule } from 'primeng/captcha'; */
import { ChipModule } from 'primeng/chip';
import { InplaceModule } from 'primeng/inplace';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { DeferModule } from 'primeng/defer';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
/* import {EditorModule} from 'primeng/editor'; */
import {ScrollerModule} from 'primeng/scroller';
import {AutoFocusModule} from 'primeng/autofocus';
import {AnimateModule} from 'primeng/animate';

export const APP_PRIMENG_MODULE = [
	SharedModule,
	TableModule,
	DialogModule,
	ConfirmDialogModule,
	DropdownModule,
	MenubarModule,
	ButtonModule,
	ListboxModule,
	RadioButtonModule,
	PanelModule,
	AccordionModule,
	CalendarModule,
	TabViewModule,
	FocusTrapModule,
	CheckboxModule,
	TreeTableModule,
	TreeModule,
	AutoCompleteModule,
	CascadeSelectModule,
	ChipsModule,
	ColorPickerModule,
	InputMaskModule,
	InputSwitchModule,
	InputTextModule,
	InputTextareaModule,
	InputNumberModule,
	KnobModule,
	KeyFilterModule,
	MultiSelectModule,
	PasswordModule,
	RatingModule,
	SliderModule,
	SelectButtonModule,
	ToggleButtonModule,
	TreeSelectModule,
	TriStateCheckboxModule,
	SplitButtonModule,
	SpeedDialModule,
	DataViewModule,
	/* GMapModule, */
	OrderListModule,
	OrganizationChartModule,
	PaginatorModule,
	PickListModule,
	TimelineModule,
	VirtualScrollerModule,
	CardModule,
	DividerModule,
	FieldsetModule,
	SplitterModule,
	ScrollPanelModule,
	ToolbarModule,
	ConfirmPopupModule,
	DynamicDialogModule,
	OverlayPanelModule,
	SidebarModule,
	TooltipModule,
	FileUploadModule,
	MenuModule,
	MegaMenuModule,
	BreadcrumbModule,
	ContextMenuModule,
	DockModule,
	PanelMenuModule,
	SlideMenuModule,
	StepsModule,
	TabMenuModule,
	TieredMenuModule,
	MessagesModule,
	MessageModule,
	ToastModule,
	CarouselModule,
	GalleriaModule,
	ImageModule,
	DragDropModule,
	AvatarModule,
	AvatarGroupModule,
	BadgeModule,
	BlockUIModule,
	/* CaptchaModule, */
	ChipModule,
	InplaceModule,
	ProgressBarModule,
	ProgressSpinnerModule,
	ScrollTopModule,
	SkeletonModule,
	TagModule,
	TerminalModule,
	DeferModule,
	StyleClassModule,
	RippleModule,
	/* EditorModule, */
  ScrollerModule,
  AutoFocusModule,
  AnimateModule
];
//
export const APP_PRIMENG_COMPONENTS = [
	Dialog,
	ConfirmDialog,
	Header,
	Footer
];
//
import { ConfirmationService } from 'primeng/api';
import { FilterService } from 'primeng/api';
import { CommonModule } from '@angular/common';

//
export const APP_PRIMENG_PROVIDERS = [
	ConfirmationService,
	FilterService,
	DialogService,
	MessageService,
];
// ===========================================================================

@NgModule({
  //declarations	: [],
  imports		: APP_PRIMENG_MODULE.concat(APP_ANGULAR_MODULE),
  exports		: APP_PRIMENG_MODULE.concat(APP_ANGULAR_MODULE)
})
export class PrimeNgModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: PrimeNgModule,
			providers: APP_PRIMENG_PROVIDERS
		};
	}
}
