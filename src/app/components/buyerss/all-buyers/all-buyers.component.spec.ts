import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBuyersComponent } from './all-buyers.component';

describe('AllBuyersComponent', () => {
  let component: AllBuyersComponent;
  let fixture: ComponentFixture<AllBuyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBuyersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
