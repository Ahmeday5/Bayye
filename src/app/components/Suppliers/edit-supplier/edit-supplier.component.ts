import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  allSuppliers,
  UpdateSupplierResponse,
} from '../../../types/supplier.type';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.scss',
})
export class EditSupplierComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('supplierImage', { static: false })
  supplierImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = '';

  supplier: allSuppliers = {
    id: 0,
    email: '',
    name: '',
    commercialName: '',
    phoneNumber: '',
    supplierType: '',
    warehouseAddress: '',
    warehouseImageUrl: '',
    deliveryMethod: '',
    profitPercentage: '',
    minimumOrderPrice: '',
    minimumOrderItems: '',
    deliveryDays: '',
    warehouseLocation: '',
    walletBalance: '',
    password: '',
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSupplierDetails();
  }

  async loadSupplierDetails() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        let page = 1;
        const pageSize = 100;
        let supplier: allSuppliers | undefined;
        // استمر في جلب الصفحات حتى يتم العثور على المورد أو نفاد الصفحات
        while (!supplier) {
          const response = await firstValueFrom(
            this.apiService.getAllSuppliers(page, pageSize)
          );
          console.log(`استجابة API للصفحة ${page}:`, response);

          // ابحث عن المورد في الصفحة الحالية
          supplier = response.items.find((ad: allSuppliers) => ad.id === +id);

          if (supplier) {
            this.supplier = {
              id: supplier.id,
              name: supplier.name,
              warehouseImageUrl: supplier.warehouseImageUrl,
              email: supplier.email,
              commercialName: supplier.commercialName,
              phoneNumber: supplier.phoneNumber,
              supplierType: supplier.supplierType,
              warehouseAddress: supplier.warehouseAddress,
              deliveryMethod: supplier.deliveryMethod,
              profitPercentage: supplier.profitPercentage.toString(),
              minimumOrderPrice: supplier.minimumOrderPrice,
              minimumOrderItems: supplier.minimumOrderItems,
              deliveryDays: supplier.deliveryDays,
              walletBalance: supplier.walletBalance,
            };
            this.currentImagePreview = supplier.warehouseImageUrl;
          } else if (page >= response.totalPages) {
            // إذا نفدت الصفحات ولم يتم العثور على المورد
            this.errorMessage = 'لم يتم العثور على المورد';
            break;
          }
          page++; // انتقل إلى الصفحة التالية
        }
      } catch (error) {
        this.errorMessage = 'فشل في جلب بيانات المورد';
        console.error('خطأ في جلب بيانات المورد:', error);
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.errorMessage = 'معرف المورد غير موجود';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
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
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB max
        this.errorMessage = 'حجم الصورة كبير جدًا (أقصى 5MB).';
        return;
      }
      this.currentImagePreview = URL.createObjectURL(file); // عرض الصورة الجديدة
    }
  }

  async handleSubmit(): Promise<void> {
    const formElement = this.formElement.nativeElement;
    if (!formElement.checkValidity()) {
      formElement.classList.add('was-validated');
      this.form.control.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('id', this.supplier.id.toString());
    formData.append('email', this.supplier.email);
    formData.append('name', this.supplier.name);
    formData.append('commercialName', this.supplier.commercialName);
    formData.append('phoneNumber', this.supplier.phoneNumber);
    formData.append('supplierType', this.supplier.supplierType);
    formData.append('warehouseAddress', this.supplier.warehouseAddress);
    formData.append('profitPercentage', this.supplier.profitPercentage);

    // إضافة الصورة الجديدة إذا كانت موجودة
    const imageFile = this.supplierImage.nativeElement.files?.[0];
    if (imageFile) {
      formData.append('WarehouseImage', imageFile); // الـ backend يتوقع 'image'
    } else {
      formData.append('WarehouseImage', this.supplier.warehouseImageUrl); // حافظ على الصورة القديمة
    }

    try {
      const response: UpdateSupplierResponse = await firstValueFrom(
        this.apiService.updateSupplier(formData, this.supplier.id)
      );
      console.log('Response from Update API:', response);
      if (response.success) {
        this.successMessage = 'تم تحديث بيانات المورد بنجاح';
        // تحديث preview لو تغيرت الصورة
        if (response.data?.warehouseImageUrl) {
          this.currentImagePreview = response.data.warehouseImageUrl;
          this.supplier.warehouseImageUrl = response.data.warehouseImageUrl;
        }
        // redirect إلى قائمة الموردين
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/all-supplier']);
        }, 3000);
      } else {
        this.errorMessage = 'فشل في تحديث بيانات المورد';
      }
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء التحديث';
      if (error && 'message' in error) {
        errorMessage = error.message;
      } else if (error instanceof HttpErrorResponse && error.error) {
        errorMessage =
          typeof error.error === 'string' ? error.error : 'خطأ غير معروف';
      }
      this.errorMessage = errorMessage;
      console.error('خطأ في تحديث المورد:', error);
    }
  }
}
