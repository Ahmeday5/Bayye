import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { adminsResponse, allAdmins } from '../../../types/admins.type';

@Component({
  selector: 'app-all-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './all-admin.component.html',
  styleUrl: './all-admin.component.scss',
})
export class AllAdminComponent implements OnInit {
  admins: allAdmins[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pages: [] = [];
  noadminsMessage: string | null = null;
  adminsMessage: string | null = null;
  totalItems: number = 0;
  searchName: string = '';
  private searchTimeout: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllAdmins(this.currentPage, this.itemsPerPage, this.searchName);
  }

  // دالة لجلب كل الادمن (مع استدعاء getVisiblePages)
  fetchAllAdmins(page: number, pageSize: number, search: string) {
    this.loading = true;
    this.noadminsMessage = null;
    this.apiService.getAllAdmins(page, pageSize, search).subscribe({
      next: (response: adminsResponse) => {
        console.log('Response from API:', response);
        this.admins = response.items || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = Math.ceil(this.totalItems / pageSize) || 1;
        this.currentPage = page;
        this.itemsPerPage = pageSize;

        if (this.admins.length === 0) {
          this.noadminsMessage = search
            ? `لا يوجد ادمن يطابقون البحث "${search}"`
            : 'لا يوجد ادمن متاحة';
        }

        console.log('Extracted admins:', this.admins);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل الادمن:', error);
        this.admins = [];
        this.noadminsMessage = 'حدث خطأ في جلب الادمن';
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
      this.fetchAllAdmins(this.currentPage, this.itemsPerPage, this.searchName);
    }, 300);
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllAdmins(this.currentPage, this.itemsPerPage, this.searchName);
    }
  }

  // دالة للذهاب لصفحة التعديل
  editSuppliers(id: string) {
    this.router.navigate(['/edit-admin', id]);
  }
}
