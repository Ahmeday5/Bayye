import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { firstValueFrom } from 'rxjs';
import {
  allSuppliers,
  SuppliersResponse,
  WalletResponse,
} from '../../../types/supplier.type';

@Component({
  selector: 'app-inactive-suppliers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './inactive-suppliers.component.html',
  styleUrl: './inactive-suppliers.component.scss',
})
export class InactiveSuppliersComponent implements OnInit {
  selectedImage: string = '';
  suppliers: allSuppliers[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pages: [] = [];
  noSuppliersMessage: string | null = null;
  suppliersMessage: string | null = null;
  totalItems: number = 0;
  searchName: string = '';
  private searchTimeout: any;
  selectedSupplierId: number | null = null;
  selectedSupplierName: string = '';
  walletAmount: number = 0;
  private timeoutId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllinActiveSuppliers(
      this.currentPage,
      this.itemsPerPage,
      this.searchName
    );
  }

  // دالة لعرض الصورة في الـ modal
  showImage(src: string) {
    this.selectedImage = src;
    this.cdr.detectChanges();
  }

  // دالة لجلب كل الموردين (مع استدعاء getVisiblePages)
  fetchAllinActiveSuppliers(page: number, pageSize: number, name: string) {
    this.loading = true;
    this.noSuppliersMessage = null;
    this.apiService.getAllinActiveSuppliers(page, pageSize, name).subscribe({
      next: (response: SuppliersResponse) => {
        console.log('Response from API:', response);
        this.suppliers = response.items || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages =
          response.totalPages || Math.ceil(this.totalItems / pageSize);
        this.currentPage = response.page || page;
        this.itemsPerPage = response.pageSize || pageSize;

        if (this.suppliers.length === 0) {
          this.noSuppliersMessage = name
            ? `لا يوجد موردين يطابقون البحث "${name}"`
            : 'لا يوجد موردين متاحة';
        }

        console.log('Extracted Suppliers:', this.suppliers);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل الموردين:', error);
        this.suppliers = [];
        this.noSuppliersMessage = error.message || 'حدث خطأ في جلب الموردين';
        this.totalItems = 0;
        this.totalPages = 0;
        this.pages = []; // مسح الصفحات
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // دالة لمعالجة إدخال البحث (بحث فوري مع debounce)
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchName = value;
      this.currentPage = 1;
      this.fetchAllinActiveSuppliers(
        this.currentPage,
        this.itemsPerPage,
        this.searchName
      );
    }, 300);
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllinActiveSuppliers(
        this.currentPage,
        this.itemsPerPage,
        this.searchName
      );
    }
  }

  activatedSupplier(id: number) {
    if (confirm('هل أنت متأكد من تنشيط هذه المورد')) {
      this.loading = true;
      this.apiService.activateSupplier(id).subscribe({
        next: (response) => {
          this.suppliersMessage = 'تم تنشيط المورد بنجاح';
          setTimeout(() => {
            this.suppliersMessage = null;
            this.fetchAllinActiveSuppliers(
              this.currentPage,
              this.itemsPerPage,
              this.searchName
            );
          }, 2000);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`خطأ في تنشيط المورد ${id}:`, error);
          this.noSuppliersMessage = 'فشل تنشيط المورد';
          this.loading = false;
          setTimeout(() => {
            this.noSuppliersMessage = null;
          }, 2000);
          this.cdr.detectChanges();
        },
      });
    }
  }
}
