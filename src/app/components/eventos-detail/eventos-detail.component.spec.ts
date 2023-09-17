import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosDetailComponent } from './eventos-detail.component';

describe('EventosDetailComponent', () => {
  let component: EventosDetailComponent;
  let fixture: ComponentFixture<EventosDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventosDetailComponent]
    });
    fixture = TestBed.createComponent(EventosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
