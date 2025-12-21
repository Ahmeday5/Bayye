import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import {
  Advertisement,
  AdvertisementsResponse,
} from '../../../types/advertisement.type';

@Component({
  selector: 'app-alladvertisements',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './alladvertisements.component.html',
  styleUrl: './alladvertisements.component.scss',
})
export class AlladvertisementsComponent implements OnInit {
  selectedImage: string = '';
  Advertisements: Advertisement[] = [];
  displayedAdvertisements: Advertisement[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pages: number[] = [];
  noAdvertisementsMessage: string | null = null;
  advertisementsMessage: string | null = null;
  totalItems: number = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchAllAdvertisements();
  }

  showImage(src: string) {
    this.selectedImage = src;
  }

  // دالة لجلب كل الاعلانات
  fetchAllAdvertisements() {
    this.loading = true;
    this.noAdvertisementsMessage = null;
    this.apiService.getAllAdvertisements().subscribe({
      next: (response: AdvertisementsResponse) => {
        console.log('Response from API:', response);
        this.Advertisements = response.items || [];
        this.totalItems = response.totalItems || this.Advertisements.length;
        console.log('Extracted Advertisements:', this.Advertisements);
        if (this.Advertisements.length === 0) {
          this.noAdvertisementsMessage = 'لا يوجد اعلانات متاحة';
        }
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // حساب الصفحات
        this.updateDisplayedAdvertisements(); // تحديث الاعلانات المعروضة
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب كل الاعلانات:', error);
        this.Advertisements = [];
        this.noAdvertisementsMessage =
          error.message || 'حدث خطأ في جلب الاعلانات';
        this.loading = false;
      },
    });
  }

  // دالة لتحديث الاعلانات المعروضين حسب الصفحة
  updateDisplayedAdvertisements() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedAdvertisements = this.Advertisements.slice(
      startIndex,
      endIndex
    );
  }

  // دالة لتغيير الصفحة
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedAdvertisements();
    }
  }

  // دالة للذهاب لصفحة التعديل
  editAdvertisement(id: number) {
    this.router.navigate(['/edit-advertisement', id]);
  }

  deleteAdvertisements(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه الاعلان')) {
      this.loading = true;
      this.apiService.deleteAdvertisement(id).subscribe({
        next: (response) => {
          this.advertisementsMessage = 'تم حذف الاعلان بنجاح';
          setTimeout(() => {
            this.advertisementsMessage = null;
            this.fetchAllAdvertisements(); // إعادة جلب الاعلانات بعد الحذف
          }, 2000);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف الاعلان ${id}:`, error);
          this.noAdvertisementsMessage = 'فشل حذف الاعلان';
          this.loading = false;
          setTimeout(() => {
            this.noAdvertisementsMessage = null;
          }, 2000);
        },
      });
    }
  }
}
