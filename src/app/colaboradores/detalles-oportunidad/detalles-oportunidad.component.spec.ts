import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOportunidadComponent } from './detalles-oportunidad.component';

describe('DetallesOportunidadComponent', () => {
  let component: DetallesOportunidadComponent;
  let fixture: ComponentFixture<DetallesOportunidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesOportunidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
