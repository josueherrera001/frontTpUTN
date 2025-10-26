import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendardateComponent } from './calendardate.component';

describe('CalendardateComponent', () => {
  let component: CalendardateComponent;
  let fixture: ComponentFixture<CalendardateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendardateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendardateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
