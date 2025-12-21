import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryStationComponent } from './delivery-station.component';

describe('DeliveryStationComponent', () => {
  let component: DeliveryStationComponent;
  let fixture: ComponentFixture<DeliveryStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryStationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
