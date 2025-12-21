import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { firstValueFrom } from 'rxjs';
import {
  inactiveBuyers,
  inactiveBuyersResponse,
  activateBuyerResponse,
} from '../../../types/inactiveBuyers.type';

@Component({
  selector: 'app-buyers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './buyers.component.html',
  styleUrl: './buyers.component.scss',
})
export class BuyersComponent implements OnInit {
  selectedImage: string = '';
  buyers: inactiveBuyers[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pages: [] = [];
  nobuyersMessage: string | null = null;
  buyersMessage: string | null = null;
  totalItems: number = 0;
  fullName: string = '';
  phoneNumber: string = '';
  private searchTimeout: any;
  private timeoutId: any;
  activatingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllBuyers(
      this.currentPage,
      this.itemsPerPage,
      this.fullName,
      this.phoneNumber
    );
  }

  // دالة لعرض الصورة في الـ modal
  showImage(src: string) {
    this.selectedImage = src;
    this.cdr.detectChanges();
  }

  fetchAllBuyers(
    page: number,
    pageSize: number,
    fullName: string,
    phoneNumber: string
  ) {
    this.loading = true;
    this.nobuyersMessage = null;
    this.apiService
      .getAllinactiveBuyers(page, pageSize, fullName, phoneNumber)
      .subscribe({
        next: (response: inactiveBuyersResponse) => {
          console.log('API Response:', response); // للتحقق من البيانات
          this.buyers = response.items || [];
          this.totalItems = response.totalItems || 0;
          this.totalPages =
            response.totalPages || Math.ceil(this.totalItems / pageSize);
          this.currentPage = response.page || page;
          this.itemsPerPage = response.pageSize || pageSize;
          console.log('Extracted buyers:', this.buyers);
          if (this.buyers.length === 0) {
            this.nobuyersMessage = fullName
              ? `لا يوجد مشترين يطابقون البحث "${fullName}"`
              : 'لا يوجد مشترين متاحة';
            this.nobuyersMessage = phoneNumber
              ? `لا يوجد مشترين يطابقون البحث "${phoneNumber}"`
              : 'لا يوجد مشترين متاحة';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('خطأ في جلب كل المشترين:', error);
          this.buyers = [];
          this.nobuyersMessage = error.message || 'حدث خطأ في جلب المشترين';
          this.totalItems = 0;
          this.totalPages = 0;
          this.pages = []; // مسح الصفحات
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  activateBuyer(id: number) {
    if (!confirm('هل أنت متأكد من تفعيل الحساب؟')) return;

    if (this.activatingId === id) return; // منع الضغط المتكرر
    
    this.activatingId = id; // بدء الـ loading
    this.buyersMessage = null; // مسح الرسائل السابقة
    this.cdr.detectChanges(); // تحديث الـ UI فورًا

    this.apiService.activateBuyer(id).subscribe({
      next: (response: activateBuyerResponse) => {
        console.log('Activate Response:', response);
        if (response.success) {
          // إزالة المشتري من القائمة محليًا
          this.buyers = this.buyers.filter((b) => b.id !== id);
          this.totalItems = this.buyers.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

          // أظهر رسالة نجاح
          this.buyersMessage = 'تم تفعيل الحساب بنجاح';
          setTimeout(() => {
            this.buyersMessage = null;
            this.cdr.detectChanges();
          }, 1500);
        } else {
          this.buyersMessage = 'فشل في تفعيل الحساب';
        }
        this.activatingId = null; // إنهاء الـ loading
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في تفعيل المشتري:', error);
        this.buyers = this.buyers.filter((b) => b.id !== id);
        this.totalItems = this.buyers.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.buyersMessage = error.message || 'حدث خطأ في تفعيل الحساب';
        this.activatingId = null; // إنهاء الـ loading
        this.cdr.detectChanges();
      },
    });
  }

  // دالة لمعالجة إدخال البحث (بحث فوري مع debounce)
  onSearchInputfullName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.fullName = value;
      this.currentPage = 1;
      this.fetchAllBuyers(
        this.currentPage,
        this.itemsPerPage,
        this.fullName,
        this.phoneNumber
      );
    }, 300);
  }

  onSearchInputphoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.phoneNumber = value;
      this.currentPage = 1;
      this.fetchAllBuyers(
        this.currentPage,
        this.itemsPerPage,
        this.fullName,
        this.phoneNumber
      );
    }, 300);
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllBuyers(
        this.currentPage,
        this.itemsPerPage,
        this.fullName,
        this.phoneNumber
      );
    }
  }
}
