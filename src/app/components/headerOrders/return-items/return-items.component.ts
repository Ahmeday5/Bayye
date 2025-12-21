import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Return } from '../../../types/returns.type';

@Component({
  selector: 'app-return-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './return-items.component.html',
  styleUrls: ['./return-items.component.scss'],
})
export class ReturnItemsComponent implements OnInit {
  returnOrder: Return | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.returnOrder = (window as any).history.state['returnOrder'] || null;
    console.log('Return Order from state:', this.returnOrder);
    if (!this.returnOrder) {
      console.warn('No return order data in state - check navigation');
    }
  }

  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
