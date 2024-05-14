import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridClientSideComponent } from './grid-client-side.component';

describe('GridClientSideComponent', () => {
  let component: GridClientSideComponent;
  let fixture: ComponentFixture<GridClientSideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridClientSideComponent]
    });
    fixture = TestBed.createComponent(GridClientSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
