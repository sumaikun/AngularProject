import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersFormComponent } from './suppliers-form.component';

describe('SuppliersFormComponent', () => {
  let component: SuppliersFormComponent;
  let fixture: ComponentFixture<SuppliersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
