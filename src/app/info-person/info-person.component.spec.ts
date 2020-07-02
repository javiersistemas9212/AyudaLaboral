import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPersonComponent } from './info-person.component';

describe('InfoPersonComponent', () => {
  let component: InfoPersonComponent;
  let fixture: ComponentFixture<InfoPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
