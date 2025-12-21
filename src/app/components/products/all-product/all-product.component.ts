import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { firstValueFrom } from 'rxjs';
import {
  allCategories,
  allProducts,
  categoryData,
  productResponse,
} from '../../../types/allproducts.type';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.scss',
})
export class AllProductComponent implements OnInit {
  selectedImage: string = '';
  Products: allProducts[] = [];
  Categories: allCategories[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: [] = [];
  noproductMessage: string | null = null;
  productMessage: string | null = null;
  totalItems: number = 0;
  productName: string = '';
  category: string = '';
  private searchTimeout: any;
  private timeoutId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllProducts(
      this.currentPage,
      this.itemsPerPage,
      this.productName,
      this.category
    );
    this.fetchAllCategories();
  }

  // دالة لعرض الصورة في الـ modal
  showImage(src: string) {
    this.selectedImage = src;
    this.cdr.detectChanges();
  }

  fetchAllProducts(
    page: number,
    pageSize: number,
    productName: string,
    category: string
  ) {
    this.loading = true;
    this.noproductMessage = null;
    this.apiService
      .getAllProducts(page, pageSize, productName, category)
      .subscribe({
        next: (response: productResponse) => {
          console.log('API Response product :', response); // للتحقق من البيانات
          this.Products = response.data?.items || [];
          this.totalItems = response.data?.totalItems || 0;
          this.totalPages =
            response.data?.totalPages || Math.ceil(this.totalItems / pageSize);
          this.currentPage = response.data?.page || page;
          this.itemsPerPage = response.data?.pageSize || pageSize;
          console.log('Extracted Products:', this.Products);
          if (this.Products.length === 0) {
            this.noproductMessage = productName
              ? `لا يوجد منتجات يطابقون البحث "${productName}"`
              : 'لا يوجد منتجات متاحة';
            this.noproductMessage = category
              ? `لا يوجد منتجات يطابقون البحث "${category}"`
              : 'لا يوجد منتجات متاحة';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('خطأ في جلب كل المنتجات :', error);
          this.Products = [];
          this.noproductMessage = error.message || 'حدث خطأ في جلب المنتجات ';
          this.totalItems = 0;
          this.totalPages = 0;
          this.pages = []; // مسح الصفحات
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  fetchAllCategories() {
    this.loading = true;
    this.noproductMessage = null;
    this.apiService.getAllCategories().subscribe({
      next: (response: categoryData) => {
        console.log('API Response Categories :', response); // للتحقق من البيانات
        this.Categories = response.data || [];
        console.log('الكاتجوري', this.Categories);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل الفئات :', error);
        this.Categories = [];
        this.noproductMessage = error.message || 'حدث خطأ في جلب الفئات ';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // دالة لمعالجة إدخال البحث (بحث فوري مع debounce)
  onSearchInputproductName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.productName = value;
      this.currentPage = 1;
      this.fetchAllProducts(
        this.currentPage,
        this.itemsPerPage,
        this.productName,
        this.category
      );
    }, 300);
  }

  onSearchInputcategory(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.category = value;
      this.currentPage = 1;
      this.fetchAllProducts(
        this.currentPage,
        this.itemsPerPage,
        this.productName,
        this.category
      );
    }, 300);
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllProducts(
        this.currentPage,
        this.itemsPerPage,
        this.productName,
        this.category
      );
    }
  }

  deleteProducts(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المنتج')) {
      this.loading = true;
      this.apiService.deleteProduct(id).subscribe({
        next: (response) => {
          this.productMessage = 'تم حذف المنتج بنجاح';
          setTimeout(() => {
            this.productMessage = null;
            this.fetchAllProducts(
              this.currentPage,
              this.itemsPerPage,
              this.productName,
              this.category
            );
          }, 2000);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`خطأ في حذف المنتج ${id}:`, error);
          this.noproductMessage = 'فشل حذف المنتج';
          this.loading = false;
          setTimeout(() => {
            this.noproductMessage = null;
          }, 2000);
          this.cdr.detectChanges();
        },
      });
    }
  }
}
