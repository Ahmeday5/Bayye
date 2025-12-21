import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSuppliersComponent } from './active-suppliers.component';

describe('ActiveSuppliersComponent', () => {
  let component: ActiveSuppliersComponent;
  let fixture: ComponentFixture<ActiveSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
