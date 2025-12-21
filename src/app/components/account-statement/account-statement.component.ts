import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../layout/pagination/pagination.component';
import { allStatement, statementResponse } from '../../types/statements.type';

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './account-statement.component.html',
  styleUrl: './account-statement.component.scss',
})
export class AccountStatementComponent implements OnInit {
  statements: allStatement[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pages: [] = [];
  nostatementsMessage: string | null = null;
  statementsMessage: string | null = null;
  totalItems: number = 0;
  commercialName: string = '';
  fromDate: string = '';
  toDate: string = '';
  private searchTimeout: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllStatements(
      this.currentPage,
      this.itemsPerPage,
      this.commercialName,
      this.fromDate,
      this.toDate
    );
  }

  // دالة لجلب كل كشف الحساب (مع استدعاء getVisiblePages)
  fetchAllStatements(
    page: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    commercialName: string
  ) {
    this.loading = true;
    this.nostatementsMessage = null;
    this.statementsMessage = null;

    // تنظيف التواريخ إذا كانت فارغة
    const cleanFromDate =
      fromDate && fromDate.trim() !== '' ? fromDate : undefined;
    const cleanToDate = toDate && toDate.trim() !== '' ? toDate : undefined;
    const cleanCommercialName =
      commercialName && commercialName.trim() !== ''
        ? commercialName
        : undefined;

    // التحقق من أن toDate لا يتم إرساله بدون fromDate
    if (cleanToDate && !cleanFromDate) {
      this.nostatementsMessage = 'يرجى اختيار تاريخ "من" أولاً';
      this.statements = [];
      this.totalItems = 0;
      this.totalPages = 0;
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.apiService
      .getAllStatement(
        page,
        pageSize,
        cleanFromDate,
        cleanToDate,
        cleanCommercialName
      )
      .subscribe({
        next: (response: statementResponse) => {
          console.log('Response from API:', response);
          this.statements = response.items || [];
          this.totalItems = response.totalItems || 0;
          this.totalPages = Math.ceil(this.totalItems / pageSize) || 1;
          this.currentPage = page;
          this.itemsPerPage = pageSize;

          if (this.statements.length === 0) {
            if (cleanCommercialName && cleanFromDate && cleanToDate) {
              this.nostatementsMessage = `لا يوجد اسم تجاري يطابق البحث "${cleanCommercialName}" في النطاق الزمني من ${cleanFromDate} إلى ${cleanToDate}`;
            } else if (cleanCommercialName && cleanFromDate) {
              this.nostatementsMessage = `لا يوجد اسم تجاري يطابق البحث "${cleanCommercialName}" في النطاق الزمني من ${cleanFromDate} `;
            } else if (cleanCommercialName) {
              this.nostatementsMessage = `لا يوجد اسم تجاري يطابق البحث "${cleanCommercialName}"`;
            } else if (cleanFromDate && cleanToDate) {
              this.nostatementsMessage = `لا يوجد كشوفات في النطاق الزمني من ${cleanFromDate} إلى ${cleanToDate}`;
            } else {
              this.nostatementsMessage = 'لا يوجد كشوفات متاحة';
            }
          }

          console.log('Extracted statements:', this.statements);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('خطأ في جلب كل كشف الحساب:', error);
          this.statements = [];
          this.nostatementsMessage = 'حدث خطأ في جلب كشف الحساب';
          this.totalItems = 0;
          this.totalPages = 0;
          this.pages = []; // مسح الصفحات
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  // دالة لمعالجة إدخال البحث (بحث فوري مع debounce)
  onSearchInput(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.fetchAllStatements(
        this.currentPage,
        this.itemsPerPage,
        this.fromDate,
        this.toDate,
        this.commercialName
      );
    }, 300);
  }

  onDateChange(): void {
    this.currentPage = 1;
    this.fetchAllStatements(
      this.currentPage,
      this.itemsPerPage,
      this.fromDate,
      this.toDate,
      this.commercialName
    );
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllStatements(
        this.currentPage,
        this.itemsPerPage,
        this.commercialName,
        this.fromDate,
        this.toDate
      );
    }
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
