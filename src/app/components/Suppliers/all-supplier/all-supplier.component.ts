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
  selector: 'app-all-supplier',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './all-supplier.component.html',
  styleUrl: './all-supplier.component.scss',
})

export class AllSupplierComponent implements OnInit {
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
    this.fetchAllSuppliers(
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

  async openWalletModal(supplierId: number, supplierName: string) {
    this.selectedSupplierId = supplierId;
    this.selectedSupplierName = supplierName;
    this.walletAmount = 0;

    try {
      const data = await firstValueFrom(
        this.apiService.getAllSuppliers(1, 1000, '')
      );
      const supplier = data.items.find(
        (s: allSuppliers) => s.id === supplierId
      );
      if (supplier) {
        this.selectedSupplierName = supplier.name;
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات المورد:', error);
    }

    const modal = document.getElementById('walletModal');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  async addToWallet() {
    if (this.selectedSupplierId === null || this.walletAmount <= 0) {
      alert('يرجى إدخال قيمة صالحة للنقود.');
      return;
    }

    try {
      const response: WalletResponse = await firstValueFrom(
        this.apiService.addToSupplierWallet(
          this.selectedSupplierId,
          this.walletAmount
        )
      );
      if (response.success) {
        // تحديث الرصيد للمورد المحدد في الـ suppliers array
        const supplierIndex = this.suppliers.findIndex(
          (s) => s.id === this.selectedSupplierId
        );
        if (supplierIndex !== -1 && response.newBalance !== undefined) {
          this.suppliers[supplierIndex].walletBalance =
            response.newBalance.toString(); // تحديث الرصيد
          this.cdr.detectChanges(); // إجبار الـ UI على التحديث
        }

        // صياغة الرسالة الجديدة
        const message = `تم إضافة ${this.walletAmount} لمحفظة المورد ${
          this.selectedSupplierName
        } بنجاح، رصيد المحفظة الآن ${response.newBalance || 'غير محدد'}`;
        this.suppliersMessage = message;

        // إخفاء الرسالة بعد 2 ثانية
        if (this.timeoutId) clearTimeout(this.timeoutId); // إلغاء الـ timeout السابق لو موجود
        this.timeoutId = setTimeout(() => {
          this.suppliersMessage = null;
          this.cdr.detectChanges();
        }, 3500);

        // إغلاق المودال
        const modal = document.getElementById('walletModal');
        if (modal) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(
            modal
          );
          modalInstance?.hide();
        }

        // مسح المتغيرات
        this.selectedSupplierId = null;
        this.selectedSupplierName = '';
        this.walletAmount = 0;
      } else {
        alert('فشل في إضافة النقود: ' + response.message);
      }
    } catch (error: any) {
      console.error('خطأ في إضافة النقود:', error);
      alert('حدث خطأ أثناء الإضافة.');
    }
  }
  
  // دالة لجلب كل الموردين (مع استدعاء getVisiblePages)
  fetchAllSuppliers(page: number, pageSize: number, name: string) {
    this.loading = true;
    this.noSuppliersMessage = null;
    this.apiService.getAllSuppliers(page, pageSize, name).subscribe({
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
      this.fetchAllSuppliers(
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
      this.fetchAllSuppliers(
        this.currentPage,
        this.itemsPerPage,
        this.searchName
      );
    }
  }

  // دالة للذهاب لصفحة التعديل
  editSuppliers(id: number) {
    this.router.navigate(['/edit-supplier', id]);
  }

  deleteSuppliers(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المورد')) {
      this.loading = true;
      this.apiService.deleteSupplier(id).subscribe({
        next: (response) => {
          this.suppliersMessage = 'تم حذف المورد بنجاح';
          setTimeout(() => {
            this.suppliersMessage = null;
            this.fetchAllSuppliers(
              this.currentPage,
              this.itemsPerPage,
              this.searchName
            );
          }, 2000);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`خطأ في حذف المورد ${id}:`, error);
          this.noSuppliersMessage = 'فشل حذف المورد';
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
