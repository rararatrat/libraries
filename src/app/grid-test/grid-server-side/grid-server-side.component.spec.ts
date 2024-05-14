import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridServerSideComponent } from './grid-server-side.component';

describe('GridServerSideComponent', () => {
  let component: GridServerSideComponent;
  let fixture: ComponentFixture<GridServerSideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridServerSideComponent]
    });
    fixture = TestBed.createComponent(GridServerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
