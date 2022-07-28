import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCadComponent } from './users-cad.component';

describe('UsersCadComponent', () => {
  let component: UsersCadComponent;
  let fixture: ComponentFixture<UsersCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
