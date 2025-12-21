import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerssComponent } from './buyerss.component';

describe('BuyerssComponent', () => {
  let component: BuyerssComponent;
  let fixture: ComponentFixture<BuyerssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
