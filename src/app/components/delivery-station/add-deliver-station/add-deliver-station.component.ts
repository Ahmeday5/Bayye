import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface DeliveryStation {
  id: number;
  name: string;
}

interface ApiResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  data: DeliveryStation[];
}

@Component({
  selector: 'app-add-deliver-station',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-deliver-station.component.html',
  styleUrl: './add-deliver-station.component.scss',
})
export class AddDeliverStationComponent {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;

  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  station: {
    name: string;
  } = {
    name: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async handleSubmit(): Promise<void> {
    // Validation
    this.formElement.nativeElement.classList.add('was-validated');
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const result = await firstValueFrom(
        this.apiService.addDeliveryStation({ name: this.station.name.trim() })
      );

      // result دايمًا هيبقى object فيه success و message
      if (result.success) {
        this.successMessage = result.message; // ← هيظهر "تم انشاء محطة توصيل جديدة بنجاح" بالظبط
        this.form.resetForm();
        this.station.name = '';
        this.formElement.nativeElement.classList.remove('was-validated');

        setTimeout(() => (this.successMessage = null), 3000);
      } else {
        this.errorMessage = result.message;
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'حدث خطأ غير متوقع';
      console.error('خطأ غير متوقع:', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
