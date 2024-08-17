import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinEditFormComponent } from './pin-edit-form.component';

describe('PinEditFormComponent', () => {
  let component: PinEditFormComponent;
  let fixture: ComponentFixture<PinEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
