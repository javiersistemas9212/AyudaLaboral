import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPersonasComponent } from './cv-personas.component';

describe('CvPersonasComponent', () => {
  let component: CvPersonasComponent;
  let fixture: ComponentFixture<CvPersonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvPersonasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
