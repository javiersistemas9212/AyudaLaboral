import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCvComponent } from './detalles-cv.component';

describe('DetallesCvComponent', () => {
  let component: DetallesCvComponent;
  let fixture: ComponentFixture<DetallesCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
