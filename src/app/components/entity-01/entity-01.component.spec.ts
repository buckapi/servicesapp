import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entity01Component } from './entity-01.component';

describe('Entity01Component', () => {
  let component: Entity01Component;
  let fixture: ComponentFixture<Entity01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entity01Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entity01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
