import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatingComponent } from './validating.component';

describe('ValidatingComponent', () => {
  let component: ValidatingComponent;
  let fixture: ComponentFixture<ValidatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
