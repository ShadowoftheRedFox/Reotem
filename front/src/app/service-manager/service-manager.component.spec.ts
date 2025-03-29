import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagerComponent } from './service-manager.component';

describe('ServiceManagerComponent', () => {
  let component: ServiceManagerComponent;
  let fixture: ComponentFixture<ServiceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
