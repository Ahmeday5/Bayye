import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../../types/orders.type';

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss'],
})
export class OrderItemsComponent implements OnInit {
  order: Order | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // غير هنا: استخدم history.state direct
    this.order = (window as any).history.state['order'] || null;
    console.log('Order from state:', this.order); // أضف log للـ debug
    if (!this.order) {
      console.warn('No order data in state - check navigation');
    }
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
