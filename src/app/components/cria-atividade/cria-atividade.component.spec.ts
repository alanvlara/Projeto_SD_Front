import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaAtividadeComponent } from './cria-atividade.component';

describe('CriaAtividadeComponent', () => {
  let component: CriaAtividadeComponent;
  let fixture: ComponentFixture<CriaAtividadeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriaAtividadeComponent]
    });
    fixture = TestBed.createComponent(CriaAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
