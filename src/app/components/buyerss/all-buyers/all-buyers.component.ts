import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { firstValueFrom } from 'rxjs';
import {
  activeBuyers,
  activeBuyersResponse,
} from '../../../types/activeBuyers.type';
import { activateBuyerResponse } from '../../../types/inactiveBuyers.type';

@Component({
  selector: 'app-all-buyers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './all-buyers.component.html',
  styleUrl: './all-buyers.component.scss',
})
export class AllBuyersComponent implements OnInit {
  selectedImage: string = '';
  Activebuyers: activeBuyers[] = [];
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
    this.fetchAllActiveBuyers(
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

  fetchAllActiveBuyers(
    page: number,
    pageSize: number,
    fullName: string,
    phoneNumber: string
  ) {
    this.loading = true;
    this.nobuyersMessage = null;
    this.apiService
      .getAllactiveBuyers(page, pageSize, fullName, phoneNumber)
      .subscribe({
        next: (response: activeBuyersResponse) => {
          console.log('API Response active buyers:', response); // للتحقق من البيانات
          this.Activebuyers = response.items || [];
          this.totalItems = response.totalItems || 0;
          this.totalPages =
            response.totalPages || Math.ceil(this.totalItems / pageSize);
          this.currentPage = response.page || page;
          this.itemsPerPage = response.pageSize || pageSize;
          console.log('Extracted buyers:', this.Activebuyers);
          if (this.Activebuyers.length === 0) {
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
          console.error('خطأ في جلب كل المشترين الناشطين:', error);
          this.Activebuyers = [];
          this.nobuyersMessage =
            error.message || 'حدث خطأ في جلب المشترين الناشطين';
          this.totalItems = 0;
          this.totalPages = 0;
          this.pages = []; // مسح الصفحات
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  inactivateBuyer(id: number) {
    if (!confirm('هل أنت متأكد من حظر الحساب؟')) return;

    if (this.activatingId === id) return; // منع الضغط المتكرر

    this.activatingId = id; // بدء الـ loading
    this.buyersMessage = null; // مسح الرسائل السابقة
    this.cdr.detectChanges(); // تحديث الـ UI فورًا

    this.apiService.inactivateBuyer(id).subscribe({
      next: (response: activateBuyerResponse) => {
        console.log('inActivate Response:', response);
        if (response.success) {
          // إزالة المشتري من القائمة محليًا
          this.Activebuyers = this.Activebuyers.filter((b) => b.id !== id);
          this.totalItems = this.Activebuyers.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

          // أظهر رسالة نجاح
          this.buyersMessage = 'تم حظر الحساب بنجاح';
          setTimeout(() => {
            this.buyersMessage = null;
            this.cdr.detectChanges();
          }, 1500);
        } else {
          this.buyersMessage = 'فشل في حظر الحساب';
        }
        this.activatingId = null; // إنهاء الـ loading
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في حظر المشتري:', error);
        this.Activebuyers = this.Activebuyers.filter((b) => b.id !== id);
        this.totalItems = this.Activebuyers.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.buyersMessage = error.message || 'حدث خطأ في حظر الحساب';
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
      this.fetchAllActiveBuyers(
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
      this.fetchAllActiveBuyers(
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
      this.fetchAllActiveBuyers(
        this.currentPage,
        this.itemsPerPage,
        this.fullName,
        this.phoneNumber
      );
    }
  }

  editbuyer(id: number) {
    this.router.navigate(['/edit-buyer', id]);
  }

  deletebuyers(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المشتري')) {
      this.loading = true;
      this.apiService.deleteBuyer(id).subscribe({
        next: (response) => {
          this.buyersMessage = 'تم حذف المشتري بنجاح';
          setTimeout(() => {
            this.buyersMessage = null;
            this.fetchAllActiveBuyers(
              this.currentPage,
              this.itemsPerPage,
              this.fullName,
              this.phoneNumber
            );
          }, 2000);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`خطأ في حذف المشتري ${id}:`, error);
          this.nobuyersMessage = 'فشل حذف المشتري';
          this.loading = false;
          setTimeout(() => {
            this.nobuyersMessage = null;
          }, 2000);
          this.cdr.detectChanges();
        },
      });
    }
  }
}
