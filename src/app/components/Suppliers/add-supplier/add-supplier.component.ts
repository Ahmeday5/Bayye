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
import {
  allSuppliers,
  AddSupplierResponse,
  addallSuppliers,
} from '../../../types/supplier.type';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.scss',
})
export class AddSupplierComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('supplierImage', { static: false })
  supplierImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = '/assets/img/advertisement/upload.jpg'; // صورة افتراضية

  supplier: addallSuppliers = {
    id: 0,
    name: '',
    email: '',
    commercialName: '',
    phoneNumber: '',
    supplierType: '',
    warehouseLocation: '',
    warehouseAddress: '',
    warehouseImageUrl: '',
    deliveryMethod: '',
    minimumOrderItems: '',
    deliveryDays: '',
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
    if (!this.form.valid || !this.supplierImage.nativeElement.files?.[0]) {
      this.form.control.markAllAsTouched();
      formElement.classList.add('was-validated');
      if (!this.supplierImage.nativeElement.files?.[0]) {
        this.errorMessage = 'يرجى رفع صورة للإعلان.';
      }
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formData = new FormData();
    formData.append('Name', this.supplier.name);
    formData.append('Email', this.supplier.email);
    formData.append('CommercialName', this.supplier.commercialName);
    formData.append('PhoneNumber', this.supplier.phoneNumber);
    formData.append('SupplierType', this.supplier.supplierType);
    formData.append('WarehouseAddress', this.supplier.warehouseAddress);
    formData.append('WarehouseLocation', this.supplier.warehouseLocation);
    formData.append('DeliveryMethod', this.supplier.deliveryMethod);
    formData.append('MinimumOrderItems', this.supplier.minimumOrderItems);
    formData.append('DeliveryDays', this.supplier.deliveryDays);
    formData.append(
      'WarehouseImage',
      this.supplierImage.nativeElement.files[0]
    );

    try {
      const response: AddSupplierResponse = await firstValueFrom(
        this.apiService.addSupplier(formData)
      );
      console.log('Response from addSuppliers API:', response);
      if (response.success) {
        this.successMessage = 'تم إضافة المورد بنجاح';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.form.resetForm();
        this.supplier = {
          id: 0,
          name: '',
          email: '',
          commercialName: '',
          phoneNumber: '',
          supplierType: '',
          warehouseLocation: '',
          warehouseAddress: '',
          warehouseImageUrl: '',
          deliveryMethod: '',
          minimumOrderItems: '',
          deliveryDays: '',
        };
        this.currentImagePreview = '/assets/img/advertisement/upload.jpg';
        if (this.supplierImage) {
          this.supplierImage.nativeElement.value = '';
        }
        formElement.classList.remove('was-validated');
      } else {
        this.errorMessage = response.message || 'فشل في إضافة المورد';
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
      console.error('خطأ في إضافة المورد:', error);
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
