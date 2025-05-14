import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrDetailAddInspectionComponent } from './carr-detail-add-inspection.component';

describe('CarrDetailAddInspectionComponent', () => {
  let component: CarrDetailAddInspectionComponent;
  let fixture: ComponentFixture<CarrDetailAddInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrDetailAddInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrDetailAddInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
