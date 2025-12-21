import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuyersComponent } from './add-buyers.component';

describe('AddBuyersComponent', () => {
  let component: AddBuyersComponent;
  let fixture: ComponentFixture<AddBuyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBuyersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
