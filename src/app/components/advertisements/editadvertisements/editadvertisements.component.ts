import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import {
  Advertisement,
  UpdateAdvertisementResponse,
} from '../../../types/advertisement.type';


@Component({
  selector: 'app-editadvertisements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editadvertisements.component.html',
  styleUrl: './editadvertisements.component.scss',
})
export class EditadvertisementsComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('advertisementImage', { static: false })
  advertisementImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = ''; // لعرض الصورة الحالية أو الجديدة

  advertisement: Advertisement = {
    id: 0,
    name: '',
    imageUrl: '',
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAdvertisementDetails();
  }

  async loadAdvertisementDetails() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const data = await firstValueFrom(
          this.apiService.getAllAdvertisements()
        );
        console.log('استجابة API:', data);
        // فلترة الإعلان بناءً على ID
        const advertisement = data.items.find(
          (ad: Advertisement) => ad.id === +id
        );
        if (advertisement) {
          this.advertisement = {
            id: advertisement.id,
            name: advertisement.name,
            imageUrl: advertisement.imageUrl,
          };
          this.currentImagePreview = advertisement.imageUrl;
        } else {
          this.errorMessage = 'لم يتم العثور على الإعلان';
        }
      } catch (error) {
        this.errorMessage = 'فشل في جلب بيانات الإعلان';
        console.error('خطأ في جلب بيانات الإعلان:', error);
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.errorMessage = 'معرف الإعلان غير موجود';
      this.isLoading = false;
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
    formData.append('id', this.advertisement.id.toString());
    formData.append('name', this.advertisement.name);

    // إضافة الصورة الجديدة إذا كانت موجودة
    const imageFile = this.advertisementImage.nativeElement.files?.[0];
    if (imageFile) {
      formData.append('image', imageFile); // الـ backend يتوقع 'image'
    } else {
      formData.append('imageUrl', this.advertisement.imageUrl); // حافظ على الصورة القديمة
    }

    try {
      const response: UpdateAdvertisementResponse = await firstValueFrom(
        this.apiService.updateAdvertisement(formData, this.advertisement.id)
      );
      console.log('Response from Update API:', response);
      if (response.success) {
        this.successMessage = 'تم تحديث بيانات الإعلان بنجاح';
        // تحديث preview لو تغيرت الصورة
        if (response.data?.imageUrl) {
          this.currentImagePreview = response.data.imageUrl;
          this.advertisement.imageUrl = response.data.imageUrl;
        }
        // redirect إلى قائمة الإعلانات
        setTimeout(() => this.router.navigate(['/all-advertisement']), 2000);
      } else {
        this.errorMessage = response.message || 'فشل في تحديث بيانات الإعلان';
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
      console.error('خطأ في تحديث الإعلان:', error);
    }
  }
}
