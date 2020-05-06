import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCcComponent } from './update-cc.component';

describe('UpdateCcComponent', () => {
  let component: UpdateCcComponent;
  let fixture: ComponentFixture<UpdateCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
