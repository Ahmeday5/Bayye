import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveSuppliersComponent } from './inactive-suppliers.component';

describe('InactiveSuppliersComponent', () => {
  let component: InactiveSuppliersComponent;
  let fixture: ComponentFixture<InactiveSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
