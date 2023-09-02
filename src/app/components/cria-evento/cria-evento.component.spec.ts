import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaEventoComponent } from './cria-evento.component';

describe('CriaEventoComponent', () => {
  let component: CriaEventoComponent;
  let fixture: ComponentFixture<CriaEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriaEventoComponent]
    });
    fixture = TestBed.createComponent(CriaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
