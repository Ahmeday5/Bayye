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
  AddProductResponse,
  allCategories,
  categoryData,
} from '../../../types/allproducts.type';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;

  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  Categories: allCategories[] = [];
  loading: boolean = true;

  product: {
    name: string;
    category: string;
    company: string;
    imageUrl: string;
  } = {
    name: '',
    category: '',
    company: '',
    imageUrl: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getAllCategories().subscribe({
      next: (response: categoryData) => {
        console.log('API Response Categories :', response); // للتحقق من البيانات
        this.Categories = response.data || [];
        console.log('الكاتجوري', this.Categories);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('خطأ في جلب كل الفئات :', error);
        this.Categories = [];
        this.errorMessage = error.message || 'حدث خطأ في جلب الفئات ';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  async handleSubmit(): Promise<void> {
    const formElement = this.formElement.nativeElement;

    if (this.formElement) {
      this.formElement.nativeElement.classList.add('was-validated');
    }
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched();
      });
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const body = {
      name: this.product.name,
      category: this.product.category,
      company: this.product.company,
      imageUrl: this.product.imageUrl,
    };

    try {
      const response: AddProductResponse = await firstValueFrom(
        this.apiService.addProduct(body)
      );
      console.log('Response from addSuppliers API:', response);
      if (response.success) {
        this.successMessage = 'تم إضافة المنتج بنجاح';
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.form.resetForm();
        this.product = {
          name: '',
          category: '',
          company: '',
          imageUrl: '',
        };
        formElement.classList.remove('was-validated');
      } else {
        this.errorMessage = response.message || 'فشل في إضافة المنتج';
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
      console.error('خطأ في إضافة المنتج:', error);
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
