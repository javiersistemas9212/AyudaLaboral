import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsjConfirmComponent } from './msj-confirm.component';

describe('MsjConfirmComponent', () => {
  let component: MsjConfirmComponent;
  let fixture: ComponentFixture<MsjConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsjConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsjConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
