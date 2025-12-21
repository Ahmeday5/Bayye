import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllDeliverStationComponent } from './get-all-deliver-station.component';

describe('GetAllDeliverStationComponent', () => {
  let component: GetAllDeliverStationComponent;
  let fixture: ComponentFixture<GetAllDeliverStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllDeliverStationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllDeliverStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
