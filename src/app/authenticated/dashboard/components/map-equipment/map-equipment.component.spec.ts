import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEquipmentComponent } from './map-equipment.component';

describe('MapEquipmentComponent', () => {
  let component: MapEquipmentComponent;
  let fixture: ComponentFixture<MapEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapEquipmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
