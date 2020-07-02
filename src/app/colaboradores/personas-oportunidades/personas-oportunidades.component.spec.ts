import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasOportunidadesComponent } from './personas-oportunidades.component';

describe('PersonasOportunidadesComponent', () => {
  let component: PersonasOportunidadesComponent;
  let fixture: ComponentFixture<PersonasOportunidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonasOportunidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasOportunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
