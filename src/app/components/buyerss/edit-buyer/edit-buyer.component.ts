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
  activeBuyers,
  activeBuyersResponse,
  AllDeliveryStation,
  UpdateBuyersResponse,
} from '../../../types/activeBuyers.type';

@Component({
  selector: 'app-edit-buyer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-buyer.component.html',
  styleUrls: ['./edit-buyer.component.scss'],
})
export class EditBuyerComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('propertyInsideImage', { static: false })
  propertyInsideImage!: ElementRef<HTMLInputElement>;
  @ViewChild('propertyOutsideImage', { static: false })
  propertyOutsideImage!: ElementRef<HTMLInputElement>;

  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentImagePreview: string = '/assets/img/advertisement/upload.jpg';
  secondImagePreview: string = '/assets/img/advertisement/upload.jpg';
  DeliveryStation: AllDeliveryStation[] = [];
  noDeliveryStationMessage: string | null = null;
  loading: boolean = true;

  buyer: activeBuyers = {
    id: 0,
    fullName: '',
    phoneNumber: '',
    propertyName: '',
    propertyType: '',
    propertyLocation: '',
    propertyAddress: '',
    propertyInsideImagePath: '',
    propertyOutsideImagePath: '',
    isActive: true,
    walletBalance: 0,
    deliveryStation: '',
    deliveryStationId: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllDeliveryStation().then(() => this.loadBuyerDetails());
  }

  async fetchAllDeliveryStation() {
    this.loading = true;
    this.noDeliveryStationMessage = null;
    try {
      const response = await firstValueFrom(
        this.apiService.getAllDeliveryStation()
      );
      this.DeliveryStation = response || [];
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('خطأ في جلب كل أماكن التوصيل:', error);
      this.DeliveryStation = [];
      this.noDeliveryStationMessage = 'فشل جلب أماكن التوصيل';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadBuyerDetails() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        let page = 1;
        const pageSize = 100;
        let buyerData: activeBuyers | undefined;
        while (!buyerData) {
          const response = await firstValueFrom(
            this.apiService.getAllactiveBuyers(page, pageSize)
          );
          buyerData = response.items.find((ad: activeBuyers) => ad.id === +id);
          if (buyerData && buyerData.deliveryStation) {
            const deliveryStation = this.DeliveryStation.find(
              (station) => station.name === buyerData!.deliveryStation
            );
            this.buyer = {
              ...this.buyer,
              id: buyerData.id,
              fullName: buyerData.fullName,
              phoneNumber: buyerData.phoneNumber,
              propertyName: buyerData.propertyName,
              propertyType: buyerData.propertyType,
              propertyLocation: buyerData.propertyLocation,
              propertyAddress: buyerData.propertyAddress,
              propertyInsideImagePath: buyerData.propertyInsideImagePath,
              propertyOutsideImagePath: buyerData.propertyOutsideImagePath,
              deliveryStation: buyerData.deliveryStation,
              deliveryStationId: deliveryStation
                ? deliveryStation.id
                : undefined,
            };
            this.currentImagePreview =
              buyerData.propertyInsideImagePath ||
              '/assets/img/advertisement/upload.jpg';
            this.secondImagePreview =
              buyerData.propertyOutsideImagePath ||
              '/assets/img/advertisement/upload.jpg';
          } else if (page >= response.totalPages) {
            this.errorMessage = 'لم يتم العثور على المشتري';
            break;
          }
          page++;
        }
      } catch (error) {
        this.errorMessage = 'فشل في جلب بيانات المشتري';
        console.error('خطأ في جلب بيانات المشتري:', error);
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.errorMessage = 'معرف المشتري غير موجود';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onImageChange(event: Event, type: 'inside' | 'outside'): void {
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
        this.errorMessage = 'حجم الصورة كبير جدًا (أقصى 5MB).';
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      if (type === 'inside') {
        this.currentImagePreview = previewUrl;
      } else if (type === 'outside') {
        this.secondImagePreview = previewUrl;
      }
      this.cdr.detectChanges();
    }
  }

  async handleSubmit(): Promise<void> {
    if (!this.formElement?.nativeElement?.checkValidity()) {
      this.formElement?.nativeElement?.classList.add('was-validated');
      this.form.control.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('id', this.buyer.id.toString());
    formData.append('FullName', this.buyer.fullName);
    formData.append('PhoneNumber', this.buyer.phoneNumber);
    formData.append('PropertyName', this.buyer.propertyName);
    formData.append('PropertyType', this.buyer.propertyType);
    formData.append('PropertyLocation', this.buyer.propertyLocation);
    formData.append('PropertyAddress', this.buyer.propertyAddress);
    if (this.buyer.deliveryStationId) {
      formData.append(
        'DeliveryStationId',
        this.buyer.deliveryStationId.toString()
      );
    } else {
      this.errorMessage = 'يرجى اختيار مكان توصيل صالح';
      return;
    }

    const insideImage = this.propertyInsideImage?.nativeElement?.files?.[0];
    if (insideImage) {
      formData.append('PropertyInsideImage', insideImage);
    }

    const outsideImage = this.propertyOutsideImage?.nativeElement?.files?.[0];
    if (outsideImage) {
      formData.append('PropertyOutsideImage', outsideImage);
    }

    try {
      const response: UpdateBuyersResponse = await firstValueFrom(
        this.apiService.updateBuyer(formData, this.buyer.id)
      );
      if (response.success) {
        this.successMessage = 'تم تحديث بيانات المشتري بنجاح';
        if (response.data?.propertyInsideImagePath) {
          this.currentImagePreview = response.data.propertyInsideImagePath;
        }
        if (response.data?.propertyOutsideImagePath) {
          this.secondImagePreview = response.data.propertyOutsideImagePath;
        }
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/all-activeBuyers']);
        }, 3000);
      } else {
        this.errorMessage = 'فشل في تحديث بيانات المشتري';
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
      console.error('خطأ في تحديث المشتري:', error);
    }
  }
}
