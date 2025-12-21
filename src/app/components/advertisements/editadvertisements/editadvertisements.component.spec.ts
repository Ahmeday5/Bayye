import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditadvertisementsComponent } from './editadvertisements.component';

describe('EditadvertisementsComponent', () => {
  let component: EditadvertisementsComponent;
  let fixture: ComponentFixture<EditadvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditadvertisementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditadvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
