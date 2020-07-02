import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoColaboradorComponent } from './info-colaborador.component';

describe('InfoColaboradorComponent', () => {
  let component: InfoColaboradorComponent;
  let fixture: ComponentFixture<InfoColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
