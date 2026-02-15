import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvationCodeComponent } from './invation-code.component';

describe('InvationCodeComponent', () => {
  let component: InvationCodeComponent;
  let fixture: ComponentFixture<InvationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvationCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
