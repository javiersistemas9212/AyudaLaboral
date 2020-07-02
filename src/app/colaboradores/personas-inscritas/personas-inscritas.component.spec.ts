import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasInscritasComponent } from './personas-inscritas.component';

describe('PersonasInscritasComponent', () => {
  let component: PersonasInscritasComponent;
  let fixture: ComponentFixture<PersonasInscritasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonasInscritasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasInscritasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
