import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { Order, OrdersResponse } from '../../../types/orders.type';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
  ], // أضف PaginationComponent
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrdersResponse | null = null;
  filterForm: FormGroup;
  showFilter = false;
  loading = false; // أضف loading flag
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  currentStatus = '';

  filterButtons = [
    { text: 'الكل', value: '' },
    { text: 'قيد الإنتظار', value: 'Pending' },
    { text: 'مؤكد', value: 'Confirmed' },
    { text: 'تم الشحن', value: 'Shipped' },
    { text: 'تم التوصيل', value: 'Delivered' },
    { text: 'ملغي من المورد', value: 'Canceled' },
  ];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      buyerName: [''],
      supplierType: [''],
    });
  }

  ngOnInit(): void {
    this.loadOrders(1);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  filterByStatus(value: string): void {
    this.currentStatus = value;
    this.currentPage = 1;
    this.loadOrders(1, this.buildParamsFromButtons());
  }

  private buildParamsFromButtons(): HttpParams {
    let params = new HttpParams();
    if (this.currentStatus) {
      params = params.set('orderStatus', this.currentStatus);
    }
    return params;
  }

  onFilter(): void {
    this.currentPage = 1;
    const formParams = this.filterForm.value;
    let params = new HttpParams();
    if (formParams.status)
      params = params.set('orderStatus', formParams.status);
    if (formParams.buyerName?.trim())
      params = params.set('buyerName', formParams.buyerName.trim());
    if (formParams.supplierType)
      params = params.set('supplierType', formParams.supplierType);
    this.loadOrders(1, params);
    this.toggleFilter();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentStatus = '';
    this.loadOrders(1);
  }

  loadOrders(page: number, params: HttpParams = new HttpParams()): void {
    this.loading = true; // set loading true
    this.currentPage = page;
    this.api.getSupplierOrders(page, this.pageSize, params).subscribe({
      next: (res) => {
        this.orders = res;
        this.totalPages = Math.ceil(res.totalCount / this.pageSize);
        this.loading = false; // set false after success
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false; // set false on error
        // Toast or alert
      },
    });
  }

  get pages(): number[] {
    // مش محتاجة دلوقتي، الـ pagination component هيحسبها
    return [];
  }

  onPageChange(page: number | undefined): void {
    // غير لتتعامل مع undefined من الـ component
    if (typeof page === 'number') {
      let params = new HttpParams();
      if (this.currentStatus)
        params = params.set('orderStatus', this.currentStatus);
      const formValues = this.filterForm.value;
      if (formValues.status)
        params = params.set('orderStatus', formValues.status);
      if (formValues.buyerName?.trim())
        params = params.set('buyerName', formValues.buyerName.trim());
      if (formValues.supplierType)
        params = params.set('supplierType', formValues.supplierType);
      this.loadOrders(page, params);
    }
  }

  viewOrder(id: number, order: Order): void {
    this.router.navigate(['/order-items'], { state: { order } });
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
