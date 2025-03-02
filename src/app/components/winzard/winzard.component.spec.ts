import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinzardComponent } from './winzard.component';

describe('WinzardComponent', () => {
  let component: WinzardComponent;
  let fixture: ComponentFixture<WinzardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinzardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinzardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
