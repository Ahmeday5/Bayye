import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddadvertisementsComponent } from './addadvertisements.component';

describe('AddadvertisementsComponent', () => {
  let component: AddadvertisementsComponent;
  let fixture: ComponentFixture<AddadvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddadvertisementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddadvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
