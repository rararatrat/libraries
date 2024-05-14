import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridClientSideRowDataAsyncComponent } from './grid-client-side-row-data-async.component';

describe('GridClientSideRowDataAsyncComponent', () => {
  let component: GridClientSideRowDataAsyncComponent;
  let fixture: ComponentFixture<GridClientSideRowDataAsyncComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridClientSideRowDataAsyncComponent]
    });
    fixture = TestBed.createComponent(GridClientSideRowDataAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
