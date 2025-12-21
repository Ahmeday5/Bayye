import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliverStationComponent } from './add-deliver-station.component';

describe('AddDeliverStationComponent', () => {
  let component: AddDeliverStationComponent;
  let fixture: ComponentFixture<AddDeliverStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeliverStationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliverStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
