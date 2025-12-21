import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { Return, ReturnsResponse } from '../../../types/returns.type';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss'],
})
export class ReturnsComponent implements OnInit {
  returns: ReturnsResponse | null = null;
  filterForm: FormGroup;
  loading = false; // أضف loading flag
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  year: string = '';
  month: string = '';
  day: string = '';
  private filterTimeout: any; // لتطبيق debounce على الفلترة التلقائية

  years: number[] = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - 5 + i
  ); // من 2020 إلى 2025
  days: string[] = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  ); // 01 إلى 31

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      buyerName: [''],
    });
  }

  ngOnInit(): void {
    this.loadReturnOrders(1);
  }

  onFilter(): void {
    this.currentPage = 1;
    const formParams = this.filterForm.value;
    let params = new HttpParams();
    if (formParams.buyerName?.trim()) {
      params = params.set('buyerName', formParams.buyerName.trim());
    }
    if (this.year && this.year.trim() !== '') {
      params = params.set('year', this.year);
      if (this.month && this.month.trim() !== '') {
        params = params.set('month', this.month);
        if (this.day && this.day.trim() !== '') {
          params = params.set('day', this.day);
        }
      }
    }
    this.loadReturnOrders(1, params);
  }

  onDateChange(): void {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.currentPage = 1;
      let params = new HttpParams();
      const formValues = this.filterForm.value;
      if (formValues.buyerName?.trim()) {
        params = params.set('buyerName', formValues.buyerName.trim());
      }
      if (this.year && this.year.trim() !== '') {
        params = params.set('year', this.year);
        if (this.month && this.month.trim() !== '') {
          params = params.set('month', this.month);
          if (this.day && this.day.trim() !== '') {
            params = params.set('day', this.day);
          }
        }
      }
      this.loadReturnOrders(this.currentPage, params);
    }, 300);
  }

  onClear(): void {
    this.filterForm.reset();
    this.year = '';
    this.month = '';
    this.day = '';
    this.loadReturnOrders(1);
  }

  loadReturnOrders(page: number, params: HttpParams = new HttpParams()): void {
    this.loading = true; // set loading true
    this.currentPage = page;
    this.api.getReturnOrders(page, this.pageSize, params).subscribe({
      next: (res) => {
        this.returns = res;
        this.totalPages = Math.ceil(res.totalCount / this.pageSize);
        this.loading = false; // set false after success
      },
      error: (err) => {
        console.error('Error loading returns:', err);
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
    if (typeof page === 'number') {
      let params = new HttpParams();
      const formValues = this.filterForm.value;
      if (formValues.buyerName?.trim()) {
        params = params.set('buyerName', formValues.buyerName.trim());
      }
      if (this.year && this.year.trim() !== '') {
        params = params.set('year', this.year);
        if (this.month && this.month.trim() !== '') {
          params = params.set('month', this.month);
          if (this.day && this.day.trim() !== '') {
            params = params.set('day', this.day);
          }
        }
      }
      this.loadReturnOrders(page, params);
    }
  }

  viewReturnOrder(id: number, returnOrder: Return): void {
    this.router.navigate(['/return-items'], { state: { returnOrder } });
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
