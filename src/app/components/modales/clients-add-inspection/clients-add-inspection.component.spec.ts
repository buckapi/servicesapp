import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAddInspectionComponent } from './clients-add-inspection.component';

describe('ClientsAddInspectionComponent', () => {
  let component: ClientsAddInspectionComponent;
  let fixture: ComponentFixture<ClientsAddInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsAddInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsAddInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
