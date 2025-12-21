import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../layout/pagination/pagination.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-get-all-deliver-station',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './get-all-deliver-station.component.html',
  styleUrl: './get-all-deliver-station.component.scss',
})
export class GetAllDeliverStationComponent {
  Stations: any[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: [] = [];
  noStationMessage: string | null = null;
  StationMessage: string | null = null;
  totalItems: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllStations(this.currentPage, this.itemsPerPage);
  }

  fetchAllStations(page: number, pageSize: number) {
    this.loading = true;
    this.noStationMessage = null;
    this.apiService.getAllDeliveryStations(page, pageSize).subscribe({
      next: (response: any) => {
        console.log('API Response station :', response); // للتحقق من البيانات
        this.Stations = response.data || [];
        this.totalItems = response.totalCount || 0;
       this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = response.data?.page || page;
        this.itemsPerPage = response.data?.pageSize || pageSize;
        console.log('Extracted Stations:', this.Stations);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل المحطات :', error);
        this.Stations = [];
        this.noStationMessage = error.message || 'حدث خطأ في جلب المحطات ';
        this.totalItems = 0;
        this.totalPages = 0;
        this.pages = []; // مسح الصفحات
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // دالة لتغيير الصفحة (مع التحقق من الـ Type)
  onPageChange(page: number | undefined): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchAllStations(this.currentPage, this.itemsPerPage);
    }
  }

  deleteStations(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المحطة')) {
      this.loading = true;
      this.apiService.deleteDeliveryStation(id).subscribe({
        next: (response) => {
          this.StationMessage = 'تم حذف المحطة بنجاح';
          setTimeout(() => {
            this.StationMessage = null;
            this.fetchAllStations(this.currentPage, this.itemsPerPage);
          }, 2000);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`خطأ في حذف المحطة ${id}:`, error);
          this.noStationMessage = 'فشل حذف المحطة';
          this.loading = false;
          setTimeout(() => {
            this.noStationMessage = null;
          }, 2000);
          this.cdr.detectChanges();
        },
      });
    }
  }
}
