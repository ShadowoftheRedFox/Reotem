import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomoComponent } from './domo.component';

describe('DomoComponent', () => {
  let component: DomoComponent;
  let fixture: ComponentFixture<DomoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
