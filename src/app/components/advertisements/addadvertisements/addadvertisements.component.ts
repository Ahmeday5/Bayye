import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Advertisement, AddResponse } from '../../../types/advertisement.type';

@Component({
  selector: 'app-addadvertisements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './addadvertisements.component.html',
  styleUrl: './addadvertisements.component.scss',
})
export class AddadvertisementsComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('advertisementImage', { static: false })
  advertisementImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = '/assets/img/advertisement/upload.jpg'; // صورة افتراضية

  advertisement: Advertisement = {
    id: 0,
    name: '',
    imageUrl: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {}

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage = ''; // امسح أي رسايل خطأ سابقة
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'image/jfif',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'نوع الصورة غير مدعوم. يرجى اختيار JPEG أو PNG.';
        input.value = ''; // امسح الملف لو مش صالح
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        this.cdr.detectChanges();
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'حجم الصورة كبير جدًا (أقصى 5MB).';
        input.value = '';
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        this.cdr.detectChanges();
        return;
      }
      this.currentImagePreview = URL.createObjectURL(file);
      this.cdr.detectChanges();
    } else {
      this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
      this.cdr.detectChanges();
    }
  }

  async handleSubmit(): Promise<void> {
    const formElement = this.formElement.nativeElement;

    // تحقق من الفورم ومن وجود الصورة
    if (!this.form.valid || !this.advertisementImage.nativeElement.files?.[0]) {
      this.form.control.markAllAsTouched();
      formElement.classList.add('was-validated');
      if (!this.advertisementImage.nativeElement.files?.[0]) {
        this.errorMessage = 'يرجى رفع صورة للإعلان.';
      }
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.advertisement.name);
    formData.append('image', this.advertisementImage.nativeElement.files[0]);

    try {
      const response: AddResponse = await firstValueFrom(
        this.apiService.addAdvertisement(formData)
      );
      console.log('Response from Add API:', response);
      if (response.success) {
        this.successMessage = 'تم إضافة الإعلان بنجاح';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.form.resetForm();
        this.advertisement = {
          id: 0,
          name: '',
          imageUrl: '',
        };
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        if (this.advertisementImage) {
          this.advertisementImage.nativeElement.value = '';
        }
        formElement.classList.remove('was-validated');
      } else {
        this.errorMessage = response.message || 'فشل في إضافة الإعلان';
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء الإضافة';
      if (error && 'message' in error) {
        errorMessage = error.message;
      } else if (error instanceof HttpErrorResponse && error.error) {
        errorMessage =
          typeof error.error === 'string' ? error.error : 'خطأ غير معروف';
      }
      this.errorMessage = errorMessage;
      console.error('خطأ في إضافة الإعلان:', error);
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (
      this.currentImagePreview &&
      !this.currentImagePreview.includes('/assets')
    ) {
      URL.revokeObjectURL(this.currentImagePreview);
    }
  }
}
