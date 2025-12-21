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
import { addallBuyers, AddBuyersResponse } from '../../../types/addBuyers.type';
import { AllDeliveryStation } from '../../../types/activeBuyers.type';

@Component({
  selector: 'app-add-buyers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-buyers.component.html',
  styleUrl: './add-buyers.component.scss',
})
export class AddBuyersComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('PropertyInsideImage', { static: false })
  PropertyInsideImage!: ElementRef<HTMLInputElement>;
  @ViewChild('PropertyOutsideImage', { static: false })
  PropertyOutsideImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = '/assets/img/advertisement/upload.jpg'; // صورة افتراضية
  secondImagePreview: string = '/assets/img/advertisement/upload.jpg'; // صورة افتراضية
  DeliveryStation: AllDeliveryStation[] = [];
  loading: boolean = true;
  noDeliveryStationMessage: string | null = null;
  DeliveryStationMessage: string | null = null;

  buyer: addallBuyers = {
    id: 0,
    FullName: '',
    PhoneNumber: '',
    PropertyName: '',
    PropertyType: '',
    PropertyLocation: '',
    PropertyAddress: '',
    DeliveryStationId: null,
    PropertyInsideImage: '',
    PropertyOutsideImage: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllDeliveryStation();
  }

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
        if (input.id === 'PropertyInsideImage') {
          this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        } else if (input.id === 'PropertyOutsideImage') {
          this.secondImagePreview = '/assets/img/advertisement/upload.jpg';
        }
        this.cdr.detectChanges();
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'حجم الصورة كبير جدًا (أقصى 5MB).';
        input.value = '';
        if (input.id === 'PropertyInsideImage') {
          this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        } else if (input.id === 'PropertyOutsideImage') {
          this.secondImagePreview = '/assets/img/advertisement/upload.jpg';
        }
        this.cdr.detectChanges();
        return;
      }
      if (input.id === 'PropertyInsideImage') {
        this.currentImagePreview = URL.createObjectURL(file);
      } else if (input.id === 'PropertyOutsideImage') {
        this.secondImagePreview = URL.createObjectURL(file);
      }
      this.cdr.detectChanges();
    } else {
      // إعادة تعيين المعاينة إذا لم يتم اختيار ملف
      if (input.id === 'PropertyInsideImage') {
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
      } else if (input.id === 'PropertyOutsideImage') {
        this.secondImagePreview = '/assets/img/advertisement/upload.jpg';
      }
      this.cdr.detectChanges();
    }
  }

  // دالة لجلب كل اماكن التوصيل
  fetchAllDeliveryStation() {
    this.loading = true;
    this.noDeliveryStationMessage = null;
    this.apiService.getAllDeliveryStation().subscribe({
      next: (response: AllDeliveryStation[]) => {
        console.log('Response from API:', response);
        this.DeliveryStation = response;
        console.log('Extracted DeliveryStation:', this.DeliveryStation);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل اماكن التوصيل:', error);
        this.DeliveryStation = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  async handleSubmit(): Promise<void> {
    const formElement = this.formElement.nativeElement;

    // تحقق من الفورم ومن وجود الصور
    if (
      !this.form.valid ||
      !this.PropertyInsideImage.nativeElement.files?.[0] ||
      !this.PropertyOutsideImage.nativeElement.files?.[0]
    ) {
      this.form.control.markAllAsTouched();
      formElement.classList.add('was-validated');
      if (!this.PropertyInsideImage.nativeElement.files?.[0]) {
        this.errorMessage = 'يرجى رفع الصورة الداخلية للمنشئ.';
      } else if (!this.PropertyOutsideImage.nativeElement.files?.[0]) {
        this.errorMessage = 'يرجى رفع الصورة الخارجية للمنشئ.';
      }
      this.cdr.detectChanges();
      return;
    }

    // تحقق من أن DeliveryStationId ليس 0
    if (this.buyer.DeliveryStationId === 0) {
      this.errorMessage = 'يرجى اختيار مكان توصيل صالح.';
      this.form.control.markAllAsTouched();
      formElement.classList.add('was-validated');
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formData = new FormData();
    formData.append('FullName', this.buyer.FullName);
    formData.append('PhoneNumber', this.buyer.PhoneNumber);
    formData.append('PropertyName', this.buyer.PropertyName);
    formData.append('PropertyType', this.buyer.PropertyType);
    formData.append('PropertyLocation', this.buyer.PropertyLocation);
    formData.append('PropertyAddress', this.buyer.PropertyAddress);
    formData.append('DeliveryStationId', this.buyer.DeliveryStationId?.toString() || '');
    formData.append(
      'PropertyInsideImage',
      this.PropertyInsideImage.nativeElement.files[0]
    );
    formData.append(
      'PropertyOutsideImage',
      this.PropertyOutsideImage.nativeElement.files[0]
    );

    // تسجيل محتوى formData للتصحيح
    console.log('FormData content:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response: AddBuyersResponse = await firstValueFrom(
        this.apiService.addBuyer(formData)
      );
      console.log('Response from addBuyer API:', response);
      if (response.success) {
        this.successMessage = 'تم إضافة المشتري بنجاح';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2000);
        this.form.resetForm();
        this.buyer = {
          id: 0,
          FullName: '',
          PhoneNumber: '',
          PropertyName: '',
          PropertyType: '',
          PropertyLocation: '',
          PropertyAddress: '',
          DeliveryStationId: null,
          PropertyInsideImage: '',
          PropertyOutsideImage: '',
        };
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        this.secondImagePreview = '/assets/img/advertisement/upload.jpg';
        if (this.PropertyInsideImage) {
          this.PropertyInsideImage.nativeElement.value = '';
        }
        if (this.PropertyOutsideImage) {
          this.PropertyOutsideImage.nativeElement.value = '';
        }
        formElement.classList.remove('was-validated');
      } else {
        this.errorMessage = response.message || 'فشل في إضافة المشتري';
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      let errorMessage = 'حدث خطأ أثناء إضافة المشتري';
      if (error.status) {
        errorMessage = `خطأ ${error.status}: ${error.statusText}`;
        if (error.status === 401) {
          errorMessage = 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.';
        } else if (error.status === 400 && error.error) {
          errorMessage =
            typeof error.error === 'string'
              ? error.error
              : 'بيانات الإدخال غير صالحة';
        } else if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      this.errorMessage = errorMessage;
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
    if (
      this.secondImagePreview &&
      !this.secondImagePreview.includes('/assets')
    ) {
      URL.revokeObjectURL(this.secondImagePreview);
    }
  }
}
