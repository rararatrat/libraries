import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridClientSideApiCallParamsComponent } from './grid-client-side-api-call-params.component';

describe('GridClientSideApiCallParamsComponent', () => {
  let component: GridClientSideApiCallParamsComponent;
  let fixture: ComponentFixture<GridClientSideApiCallParamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridClientSideApiCallParamsComponent]
    });
    fixture = TestBed.createComponent(GridClientSideApiCallParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
