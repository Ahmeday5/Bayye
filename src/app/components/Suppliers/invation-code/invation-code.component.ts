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
  AddCodeResponse,
  CodeDataResponse,
  ReferralCode,
} from '../../../types/code.type';

@Component({
  selector: 'app-invation-code',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invation-code.component.html',
  styleUrl: './invation-code.component.scss',
})
export class InvationCodeComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('form', { static: false, read: ElementRef })
  formElement!: ElementRef<HTMLFormElement>;

  isSubmitting = false; // لـ loading زرار الإضافة
  isDeleting = false; // لـ loading أثناء الحذف (اختياري إذا حابب تضيفه لكل سطر)
  tableLoading = true; // لـ loading الجدول ككل

  successMessage: string | null = null;
  errorMessage: string | null = null;

  Codes: ReferralCode[] = [];

  formData = {
    code: '',
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchAllCodes();
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.formElement.nativeElement.classList.add('was-validated');
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const body = { code: this.formData.code.trim() };

    try {
      const res = await firstValueFrom(this.apiService.addCode(body));

      // نعرض الرسالة اللي رجعت من الباك إند مباشرة
      this.successMessage = res.message || 'تم إضافة الكود بنجاح';

      // إعادة تعيين الفورم
      this.form.resetForm();
      this.formData = { code: '' };
      this.formElement.nativeElement.classList.remove('was-validated');

      // تحديث الجدول
      this.fetchAllCodes();

      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => (this.successMessage = null), 3000);
    } catch (err: any) {
      this.errorMessage =
        err?.error?.message ||
        err?.message ||
        'حدث خطأ أثناء إضافة الكود، حاول مرة أخرى';
      console.error('Add code error:', err);
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  fetchAllCodes() {
    this.tableLoading = true;
    this.errorMessage = null;

    this.apiService.getAllCodes().subscribe({
      next: (res: ReferralCode[]) => {
        this.Codes = res || [];
        this.tableLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('خطأ جلب الأكواد:', err);
        this.errorMessage = err?.message || 'فشل جلب الأكواد';
        this.tableLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  deletingIds: Set<number> = new Set<number>();
  async deleteCode(id: number, code: string) {
    if (!confirm(`متأكد من حذف الكود ${code} ؟`)) return;

    this.deletingIds.add(id);
    this.successMessage = null;
    this.errorMessage = null;

    try {
      const res = await firstValueFrom(this.apiService.deleteCode(id));

      // نعرض رسالة الباك إند الفعلية
      this.successMessage = res.message || 'تم حذف الكود بنجاح';

      // تحديث الجدول بعد الحذف
      this.fetchAllCodes();

      setTimeout(() => (this.successMessage = null), 3000);
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'فشل حذف الكود، حاول مرة أخرى';
      console.error('Delete error:', err);
    } finally {
      this.deletingIds.delete(id);
      this.cdr.detectChanges();
    }
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}
