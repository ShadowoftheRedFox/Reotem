import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteLogsComponent } from './website-logs.component';

describe('WebsiteLogsComponent', () => {
  let component: WebsiteLogsComponent;
  let fixture: ComponentFixture<WebsiteLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
