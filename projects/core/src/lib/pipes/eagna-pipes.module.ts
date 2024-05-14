import { NgModule } from '@angular/core';
import { CommonModule,  DatePipe,  DecimalPipe,  I18nPluralPipe,  JsonPipe, LowerCasePipe, NgLocalization, PercentPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { EagnaTestPipe, CustomPluralPipe, GetInitialsPipe, IsNotEmptyPipe, AbstractToFormControlPipe, AbstractToFormArrayPipe, FilterByPipe, IncludeByPipe, ExcludeByPipe, HighlightSearchPipe, AutoCompleteHighlightPipe, ReplaceAllPipe, PluckPipe, QuickFilterPipe, CapitalizeFirstPipe, MergeToPipe, FlatMapPipe, ObjToArrayPipe, ArrayToObjPipe, TranslateFieldPipe } from './eagna.pipe';

const _pipes: any = [
  EagnaTestPipe,
  AbstractToFormControlPipe,
  AutoCompleteHighlightPipe,
  AbstractToFormArrayPipe,
  CapitalizeFirstPipe,
  CustomPluralPipe,
  ExcludeByPipe,
  FilterByPipe,
  GetInitialsPipe,
  HighlightSearchPipe,
  IncludeByPipe,
  IsNotEmptyPipe,
  MergeToPipe,
  FlatMapPipe,
  PluckPipe,
  QuickFilterPipe,
  ReplaceAllPipe,
  ObjToArrayPipe,
  ArrayToObjPipe,
  TranslateFieldPipe
  /* JsonDebugPipe */
];

const _corePipes: any = [
  UpperCasePipe, LowerCasePipe, TitleCasePipe, JsonPipe, DatePipe, I18nPluralPipe, DecimalPipe, PercentPipe
];

const _customProviders: any[] = []

@NgModule({
  declarations: _pipes,
  imports: [CommonModule],
  exports: [].concat(_corePipes, _pipes),
  providers: [].concat(_corePipes, _pipes)
})
export class EagnaPipesModule {}
