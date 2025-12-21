import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlladvertisementsComponent } from './alladvertisements.component';

describe('AlladvertisementsComponent', () => {
  let component: AlladvertisementsComponent;
  let fixture: ComponentFixture<AlladvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlladvertisementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlladvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
