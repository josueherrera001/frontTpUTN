import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaddheaderComponent } from './formaddheader.component';

describe('FormaddheaderComponent', () => {
  let component: FormaddheaderComponent;
  let fixture: ComponentFixture<FormaddheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaddheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormaddheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
