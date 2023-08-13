import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaudosImportComponent } from './laudos-import.component';

describe('LaudosImportComponent', () => {
  let component: LaudosImportComponent;
  let fixture: ComponentFixture<LaudosImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaudosImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaudosImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
