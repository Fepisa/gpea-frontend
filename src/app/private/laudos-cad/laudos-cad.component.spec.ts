import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaudosCadComponent } from './laudos-cad.component';

describe('LaudosCadComponent', () => {
  let component: LaudosCadComponent;
  let fixture: ComponentFixture<LaudosCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaudosCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaudosCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
