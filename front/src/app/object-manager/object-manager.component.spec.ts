import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectManagerComponent } from './object-manager.component';

describe('ObjectManagerComponent', () => {
  let component: ObjectManagerComponent;
  let fixture: ComponentFixture<ObjectManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
