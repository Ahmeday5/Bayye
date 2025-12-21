import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { LoginCredentials, LoginResponse } from '../types/login.type';
import {
  Advertisement,
  AdvertisementsResponse,
  UpdateAdvertisementResponse,
  AddResponse,
} from '../types/advertisement.type';
import {
  AddSupplierResponse,
  allSuppliers,
  SuppliersResponse,
  UpdateSupplierResponse,
  WalletResponse,
} from '../types/supplier.type';
import {
  inactiveBuyersResponse,
  activateBuyerResponse,
} from '../types/inactiveBuyers.type';
import { OrdersResponse } from '../types/orders.type';
import { ReturnsResponse } from '../types/returns.type';
import { adminsResponse, AddAdminResponse } from '../types/admins.type';
import { allStatement, statementResponse } from '../types/statements.type';
import {
  activeBuyers,
  activeBuyersResponse,
  AllDeliveryStation,
  UpdateBuyersResponse,
} from '../types/activeBuyers.type';
import { addallBuyers, AddBuyersResponse } from '../types/addBuyers.type';
import {
  AddProductResponse,
  allProducts,
  categoryData,
  productResponse,
} from '../types/allproducts.type';

@Injectable({
  providedIn: 'root', // جعل الخدمة متاحة لكل التطبيق
})
export class ApiService {
  private baseUrl = 'http://78.89.159.126:9393/TheOneAPIBayyaa';

  constructor(private http: HttpClient) {}

  /***********************************login********************************************/

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const loginUrl = `${this.baseUrl}/api/Dashboard/login`;

    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'حدث خطأ غير معروف';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
        } else if (error.status === 401) {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        } else if (error.status === 503) {
          errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
        }
        console.error('خطأ في تسجيل الدخول:', error);
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  /************************************************Dasboard****************************************************************/

  // الاند بوينتات الجديدة
  getTotalBuyers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/buyers/count`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع المشترين:', error);
          return throwError(() => new Error('فشل جلب مجموع المشترين'));
        })
      );
  }

  getTotalactiveBuyers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/activeBuyers/count`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع المشترين:', error);
          return throwError(() => new Error('فشل جلب مجموع المشترين'));
        })
      );
  }

  getTotalinactiveBuyers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/notActiveBuyers/count`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع المشترين:', error);
          return throwError(() => new Error('فشل جلب مجموع المشترين'));
        })
      );
  }

  getTotalSuppliers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/suppliers/count`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع الموردين:', error);
          return throwError(() => new Error('فشل جلب مجموع الموردين'));
        })
      );
  }

  getTotalActiveSuppliers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/activeSuppliers/count`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع الموردين:', error);
          return throwError(() => new Error('فشل جلب مجموع الموردين'));
        })
      );
  }

  getTotalinactiveSuppliers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/NotAactiveSuppliers/count`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب مجموع الموردين:', error);
          return throwError(() => new Error('فشل جلب مجموع الموردين'));
        })
      );
  }

  getTotalOrdersToday(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/orders/today-count`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب إجمالي الطلبات اليومية:', error);
          return throwError(() => new Error('فشل جلب إجمالي الطلبات اليومية'));
        })
      );
  }

  getTotalOrderMonth(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Dashboard/orders/month-count`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب اجمالي الطلبات الشهرية:', error);
          return throwError(() => new Error('فشل جلب اجمالي الطلبات الشهرية'));
        })
      );
  }

  /***************************************************advertisements*******************************************************/

  // دالة جديدة لجلب كل الاعلانات
  getAllAdvertisements(): Observable<AdvertisementsResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token
    return this.http
      .get<AdvertisementsResponse>(
        `${this.baseUrl}/api/Dashboard/getAllAdvertisements`,
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('Full API Response:', response); // log للـ response الكامل
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في جلب كل الاعلانات:', error);
          let errorMessage = 'فشل جلب كل الاعلانات';
          if (error.status === 0) {
            errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
          } else if (error.status === 401) {
            errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
            // ممكن تضيف redirect للـ login هنا
          } else if (error.status === 404) {
            errorMessage = 'الـ endpoint غير موجود.';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**************Editadvertisement**************** */

  updateAdvertisement(
    formData: FormData,
    id: number
  ): Observable<UpdateAdvertisementResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .put<UpdateAdvertisementResponse>(
        `${this.baseUrl}/api/Dashboard/updateAdvertisement/${id}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        map((response) => {
          console.log('Update Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في تحديث الإعلان:', error);
          let errorMessage = 'حدث خطأ أثناء التحديث';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(() => ({ success: false, message: errorMessage }));
        })
      );
  }

  //مسح الاعلان
  deleteAdvertisement(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/deleteAdvertisement/${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الاعلان ${id}:`, error);
          return throwError(() => new Error(`فشل حذف الاعلان ${id}`));
        })
      );
  }

  /*********Addadvertisement***********/

  addAdvertisement(formData: FormData): Observable<AddResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .post<{ message: string; data: Advertisement }>(
        `${this.baseUrl}/api/Dashboard/addAdvertisement`,
        formData,
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('Add Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          } as AddResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في إضافة الإعلان:', error);
          let errorMessage = 'حدث خطأ أثناء الإضافة';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(
            () => ({ success: false, message: errorMessage } as AddResponse)
          );
        })
      );
  }

  /***************************************************suppliers*******************************************************/

  /*********Addsupplier***********/

  addSupplier(formData: FormData): Observable<AddSupplierResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .post<{ message: string; data: allSuppliers }>(
        `${this.baseUrl}/api/Dashboard/addSupplier`,
        formData,
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('addSupplier Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          } as AddSupplierResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في إضافة المورد:', error);
          let errorMessage = 'حدث خطأ أثناء الإضافة';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(
            () =>
              ({ success: false, message: errorMessage } as AddSupplierResponse)
          );
        })
      );
  }

  // دالة جديدة لجلب كل الموردين
  getAllSuppliers(
    page?: number,
    pageSize?: number,
    name?: string
  ): Observable<SuppliersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getAllSuppliers`;
    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (name !== undefined && name.trim() !== '') {
      params.push(`name=${encodeURIComponent(name)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<SuppliersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل الاعلانات:', error);
        let errorMessage = 'فشل جلب كل الاعلانات';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // دالة جديدة لجلب كل الموردين الناشطين
  getAllActiveSuppliers(
    page?: number,
    pageSize?: number,
    name?: string
  ): Observable<SuppliersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getActiveSuppliers`;
    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (name !== undefined && name.trim() !== '') {
      params.push(`name=${encodeURIComponent(name)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<SuppliersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل الموردين الناشطين:', error);
        let errorMessage = 'فشل جلب كل الموردين الناشطين';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // دالة جديدة لجلب كل الموردين الناشطين
  getAllinActiveSuppliers(
    page?: number,
    pageSize?: number,
    name?: string
  ): Observable<SuppliersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getInactiveSuppliers`;
    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (name !== undefined && name.trim() !== '') {
      params.push(`name=${encodeURIComponent(name)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<SuppliersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل الموردين غير الناشطين:', error);
        let errorMessage = 'فشل جلب كل الموردين غير الناشطين';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**************Editsupplier**************** */

  updateSupplier(
    formData: FormData,
    id: number
  ): Observable<UpdateSupplierResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .put<UpdateSupplierResponse>(
        `${this.baseUrl}/api/Dashboard/updateSupplier/${id}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        map((response) => {
          console.log('Update Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في تحديث المورد:', error);
          let errorMessage = 'حدث خطأ أثناء التحديث';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(() => ({ success: false, message: errorMessage }));
        })
      );
  }

  //مسح المورد
  deleteSupplier(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/deleteSupplier/${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المورد ${id}:`, error);
          return throwError(() => new Error(`فشل حذف المورد ${id}`));
        })
      );
  }

  //حظر المورد
  deactivateSupplier(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token ? token : 'No token found');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Dashboard/${id}/deactivate`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`خطأ في حظر المورد ${id}:`, error);
          let errorMessage = `فشل حظر المورد ${id}`;
          if (error.status === 401) {
            errorMessage = 'غير مصرح. تحقق من الـ token أو الصلاحيات.';
          } else if (error.status === 400) {
            errorMessage = 'طلب غير صالح. تحقق من بيانات الطلب.';
          } else if (error.status === 404) {
            errorMessage = 'المورد غير موجود.';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  //تنشيط المورد
  activateSupplier(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token ? token : 'No token found');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Dashboard/${id}/activate`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`خطأ في تنشيط المورد ${id}:`, error);
          let errorMessage = `فشل تنشيط المورد ${id}`;
          if (error.status === 401) {
            errorMessage = 'غير مصرح. تحقق من الـ token أو الصلاحيات.';
          } else if (error.status === 400) {
            errorMessage = 'طلب غير صالح. تحقق من بيانات الطلب.';
          } else if (error.status === 404) {
            errorMessage = 'المورد غير موجود.';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**********Supplier Wallet************/

  addToSupplierWallet(
    supplierId: number,
    amount: number
  ): Observable<WalletResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });

    const body = { supplierId: supplierId, amount: amount };
    const url = `${this.baseUrl}/api/Dashboard/addToSupplierWallet`;

    return this.http.post<WalletResponse>(url, body, { headers }).pipe(
      map((response) => {
        console.log('Add to Wallet Response:', response);
        return {
          success: true, // افتراض النجاح بناءً على وجود newBalance
          message: response.message,
          newBalance: response.newBalance || undefined, // إضافة newBalance إذا موجود
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في إضافة النقود للمحفظة:', error);
        let errorMessage = 'حدث خطأ أثناء الإضافة';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status) {
          errorMessage = `خطأ ${error.status}: ${error.statusText}`;
        }
        return throwError(
          () => ({ success: false, message: errorMessage } as WalletResponse)
        );
      })
    );
  }

  /******************************************buyers***********************************************/

  /*********Addbuyer***********/

  addBuyer(formData: FormData): Observable<AddBuyersResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    console.log(
      'Sending addBuyer request with token:',
      token ? 'Present' : 'Missing'
    );
    console.log('FormData content:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return this.http
      .post<{ message: string; data: addallBuyers }>(
        `${this.baseUrl}/api/Dashboard/addBuyer`,
        formData,
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('addBuyer Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          } as AddBuyersResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error in addBuyer:', error);
          let errorMessage = 'حدث خطأ أثناء إضافة المشتري';
          if (error.status === 0) {
            errorMessage =
              'فشل الاتصال بالخادم. تحقق من الشبكة أو إعدادات CORS.';
          } else if (error.status === 401) {
            errorMessage = 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.';
          } else if (error.status === 400 && error.error) {
            errorMessage =
              typeof error.error === 'string'
                ? error.error
                : 'بيانات الإدخال غير صالحة';
          } else if (error.status === 404) {
            errorMessage = 'الـ endpoint غير موجود.';
          } else if (error.status === 500) {
            errorMessage = 'خطأ في الخادم. حاول مرة أخرى لاحقًا.';
          }
          return throwError(
            () =>
              ({ success: false, message: errorMessage } as AddBuyersResponse)
          );
        })
      );
  }

  // دالة جديدة لجلب كل المشترين غير الناشطين
  getAllinactiveBuyers(
    page?: number,
    pageSize?: number,
    fullName?: string,
    phoneNumber?: string
  ): Observable<inactiveBuyersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getInactiveBuyers`;

    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (fullName !== undefined && fullName.trim() !== '') {
      params.push(`fullName=${encodeURIComponent(fullName)}`);
    }
    if (phoneNumber !== undefined && phoneNumber.trim() !== '') {
      params.push(`phoneNumber=${encodeURIComponent(phoneNumber)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<inactiveBuyersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل المشترين الغير ناشطين:', error);
        let errorMessage = 'فشل جلب كل المشترين الغير ناشطين';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // دالة جديدة لجلب كل المشترين غير الناشطين
  getAllactiveBuyers(
    page?: number,
    pageSize?: number,
    fullName?: string,
    phoneNumber?: string
  ): Observable<activeBuyersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getAllActiveBuyers`;

    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (fullName !== undefined && fullName.trim() !== '') {
      params.push(`fullName=${encodeURIComponent(fullName)}`);
    }
    if (phoneNumber !== undefined && phoneNumber.trim() !== '') {
      params.push(`phoneNumber=${encodeURIComponent(phoneNumber)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<activeBuyersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل المشترين الناشطين:', error);
        let errorMessage = 'فشل جلب كل المشترين الناشطين';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  activateBuyer(Id: number): Observable<activateBuyerResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.baseUrl}/api/Dashboard/activateBuyer/${Id}`;

    return this.http.put<any>(url, {}, { headers }).pipe(
      map((response) => {
        console.log('Add to activateBuyer Response:', response);
        return {
          success: response.message.toLowerCase().includes('successfully'),
          message: 'تم تفعيل الحساب بنجاح',
          data: response.data || undefined,
        } as activateBuyerResponse;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في تفعيل ايميل العميل:', error);
        let errorMessage = 'حدث خطأ أثناء التفعيل';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status) {
          errorMessage = `خطأ ${error.status}: ${error.statusText}`;
        }
        return throwError(
          () =>
            ({ success: false, message: errorMessage } as activateBuyerResponse)
        );
      })
    );
  }

  inactivateBuyer(Id: number): Observable<activateBuyerResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.baseUrl}/api/Dashboard/deactivateBuyer/${Id}`;

    return this.http.put<any>(url, {}, { headers }).pipe(
      map((response) => {
        console.log('Add to inactivateBuyer Response:', response);
        return {
          success: response.message.toLowerCase().includes('successfully'),
          message: 'تم حظر الحساب بنجاح',
          data: response.data || undefined,
        } as activateBuyerResponse;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في حظر ايميل العميل:', error);
        let errorMessage = 'حدث خطأ أثناء الحظر';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status) {
          errorMessage = `خطأ ${error.status}: ${error.statusText}`;
        }
        return throwError(
          () =>
            ({ success: false, message: errorMessage } as activateBuyerResponse)
        );
      })
    );
  }

  /**************Editbuyer**************** */

  updateBuyer(
    formData: FormData,
    id: number
  ): Observable<UpdateBuyersResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .put<UpdateBuyersResponse>(
        `${this.baseUrl}/api/Dashboard/updateBuyer/${id}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        map((response) => {
          console.log('Update Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في تحديث المشتري:', error);
          let errorMessage = 'حدث خطأ أثناء التحديث';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(() => ({ success: false, message: errorMessage }));
        })
      );
  }

  //مسح المشتري
  deleteBuyer(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/deleteBuyer/${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المشتري ${id}:`, error);
          return throwError(() => new Error(`فشل حذف المشتري ${id}`));
        })
      );
  }

  getAllDeliveryStation(): Observable<AllDeliveryStation[]> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Supplier/getAllDeliveryStation`;

    return this.http.get<AllDeliveryStation[]>(url, { headers }).pipe(
      map((response) => response || {}),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل اماكن التوصيل:', error);
        let errorMessage = 'فشل جلب كل اماكن التوصيل ';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /********************************************orders*************************************************/

  // دالة جلب الطلبات
  getSupplierOrders(
    page: number = 1,
    pageSize: number = 10,
    params?: HttpParams
  ): Observable<OrdersResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let url = `${this.baseUrl}/api/Dashboard/getSupplierOrders?page=${page}&pageSize=${pageSize}`;
    if (params && params.keys().length > 0) {
      url += `&${params.toString()}`;
    }

    return this.http.get<OrdersResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || { totalCount: 0, page: 1, pageSize: 10, data: [] }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب الطلبات:', error);
        let errorMessage = 'فشل جلب الطلبات';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح. سجل دخول مرة أخرى.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /********************************************orders*************************************************/

  // دالة جلب الطلبات
  getReturnOrders(
    page: number = 1,
    pageSize: number = 10,
    params?: HttpParams
  ): Observable<ReturnsResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let url = `${this.baseUrl}/api/Dashboard/getReturnOrders?page=${page}&pageSize=${pageSize}`;
    if (params && params.keys().length > 0) {
      url += `&${params.toString()}`;
    }

    return this.http.get<ReturnsResponse>(url, { headers }).pipe(
      map(
        (response) =>
          response || { totalCount: 0, page: 1, pageSize: 10, data: [] }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب المرتجعات:', error);
        let errorMessage = 'فشل جلب المرتجعات';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح. سجل دخول مرة أخرى.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /***************************************************admins*******************************************************/

  // دالة جديدة لجلب كل الادمن
  getAllAdmins(
    page?: number,
    pageSize?: number,
    search?: string
  ): Observable<adminsResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getAllAppOwners`;
    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (search !== undefined && search.trim() !== '') {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<adminsResponse>(url, { headers }).pipe(
      map((response) => {
        console.log('API Response:', response); // log للتحقق
        return response || { items: [], totalItems: 0 };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل الادمن:', error);
        let errorMessage = 'فشل جلب كل الادمن';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /*****update admin*****/

  updateAdmin(
    id: string,
    body: { email: string; role: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http
      .put(`${this.baseUrl}/api/Dashboard/updateAppOwner/${id}`, body, {
        headers,
        responseType: 'text', // نص بسيط زي "Doctor updated successfully"
      })
      .pipe(
        map((response: string) => {
          // تحقق من الاستجابة بناءً على النص بدقة أكبر
          const lowerCaseResponse = response.toLowerCase().trim(); // تحويل لصغير وإزالة المسافات
          if (lowerCaseResponse.includes('successfully')) {
            return { success: true, message: response }; // نجاح
          } else {
            return { success: false, message: response }; // فشل
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في تحديث الادمن:', error);
          let errorMessage = 'حدث خطأ أثناء التحديث';
          if (
            error.status === 400 &&
            error.error &&
            Array.isArray(error.error)
          ) {
            // التعامل مع duplicate email (array من errors)
            const duplicateError = error.error.find(
              (err: any) => err.code === 'DuplicateUserName'
            );
            if (duplicateError) {
              errorMessage =
                'البريد الإلكتروني مستخدم بالفعل. يرجى إدخال بريد إلكتروني آخر.';
            } else {
              errorMessage =
                error.error.map((err: any) => err.description).join(', ') ||
                `خطأ ${error.status}: ${error.statusText}`;
            }
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(() => ({ success: false, message: errorMessage }));
        })
      );
  }

  /*********add admin*********/
  addAdmin(body: {
    email: string;
    password: string;
    role: string;
  }): Observable<AddAdminResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.baseUrl}/api/Dashboard/addAppOwner`, body, { headers })
      .pipe(
        map((response: any) => {
          const success = response.message
            .toLowerCase()
            .includes('successfully');
          return {
            success,
            message: success ? 'تم إضافة الادمن بنجاح' : response.message,
            data: response.userId
              ? {
                  userId: response.userId,
                  email: response.email,
                  role: response.role,
                }
              : undefined,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في إضافة الادمن:', error);
          let errorMessage = 'حدث خطأ أثناء الإضافة';
          if (
            error.status === 400 &&
            error.error &&
            Array.isArray(error.error)
          ) {
            const passwordErrors = error.error.filter(
              (err: any) =>
                err.code === 'PasswordRequiresNonAlphanumeric' ||
                err.code === 'PasswordRequiresLower' ||
                err.code === 'PasswordRequiresUpper'
            );
            if (passwordErrors.length > 0) {
              errorMessage =
                'كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، ورمز غير أبجدي واحد على الأقل.';
            } else {
              errorMessage =
                error.error.map((err: any) => err.description).join(', ') ||
                `خطأ ${error.status}: ${error.statusText}`;
            }
          } else if (typeof error.error === 'string') {
            if (
              error.error.toLowerCase().includes('email is already registered')
            ) {
              errorMessage =
                'البريد الإلكتروني مستخدم بالفعل. يرجى إدخال بريد إلكتروني آخر.';
            } else {
              errorMessage = error.error;
            }
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(() => ({ success: false, message: errorMessage }));
        })
      );
  }

  /***************************************************statement*******************************************************/

  // دالة جديدة لجلب كل كشف الحساب
  getAllStatement(
    page?: number,
    pageSize?: number,
    fromDate?: string,
    toDate?: string,
    commercialName?: string
  ): Observable<statementResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/getSupplierStatements`;
    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (commercialName !== undefined && commercialName.trim() !== '') {
      params.push(`commercialName=${encodeURIComponent(commercialName)}`);
    }
    if (fromDate !== undefined && fromDate.trim() !== '') {
      params.push(`fromDate=${encodeURIComponent(fromDate)}`);
    }
    if (toDate !== undefined && toDate.trim() !== '') {
      params.push(`toDate=${encodeURIComponent(toDate)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<statementResponse>(url, { headers }).pipe(
      map((response) => {
        console.log('API Response:', response); // log للتحقق
        return response || { items: [], totalItems: 0 };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل كشف الحساب:', error);
        let errorMessage = 'فشل جلب كل كشف الحساب';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /*******************************************products**************************************************/

  /*********AddProduct***********/

  addProduct(body: {
    name: string;
    category: string;
    company: string;
    imageUrl: string;
  }): Observable<AddProductResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    const url = `${this.baseUrl}/api/Dashboard/addProduct`;

    return this.http
      .post<{ message: string; data: allProducts }>(url, body, { headers })
      .pipe(
        map((response) => {
          console.log('addProduct Response:', response);
          return {
            success: response.message.toLowerCase().includes('successfully'),
            message: response.message,
            data: response.data,
          } as AddProductResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('خطأ في إضافة المنتج:', error);
          let errorMessage = 'حدث خطأ أثناء الإضافة';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status) {
            errorMessage = `خطأ ${error.status}: ${error.statusText}`;
          }
          return throwError(
            () =>
              ({ success: false, message: errorMessage } as AddProductResponse)
          );
        })
      );
  }

  getAllProducts(
    page?: number,
    pageSize?: number,
    productName?: string,
    category?: string
  ): Observable<productResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Dashboard/products`;

    let params: string[] = [];

    if (page !== undefined) {
      params.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      params.push(`pageSize=${pageSize}`);
    }
    if (productName !== undefined && productName.trim() !== '') {
      params.push(`productName=${encodeURIComponent(productName)}`);
    }
    if (category !== undefined && category.trim() !== '') {
      params.push(`category=${encodeURIComponent(category)}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<productResponse>(url, { headers }).pipe(
      map((response) => {
        if (!response?.data) {
          return {
            message: 'Products retrieved successfully',
            data: {
              items: [],
              page: 1,
              pageSize: 10,
              totalItems: 0,
              totalPages: 0,
            },
          };
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل المنتجات:', error);
        let errorMessage = 'فشل جلب كل المنتجات ';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAllCategories(): Observable<categoryData> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // log للتحقق من الـ token

    // بناء URL ديناميكي
    let url = `${this.baseUrl}/api/Buyer/categories`;

    return this.http.get<categoryData>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            message: 'Categories retrieved successfully',
            data: [],
          }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('خطأ في جلب كل الفئات:', error);
        let errorMessage = 'فشل جلب كل الفئات ';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.';
          // ممكن تضيف redirect للـ login هنا
        } else if (error.status === 404) {
          errorMessage = 'الـ endpoint غير موجود.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  //مسح المنتج
  deleteProduct(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Dashboard/deleteProduct/${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المنتج ${id}:`, error);
          return throwError(() => new Error(`فشل حذف المنتج ${id}`));
        })
      );
  }

  /*******************************DeliveryStations************************************************/

  // جلب كل محطات التوصيل مع pagination
  getAllDeliveryStations(page?: number, pageSize?: number): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let url = `${this.baseUrl}/api/Dashboard/getAllDeliveryStations?page=${page}&pageSize=${pageSize}`;

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('خطأ في جلب محطات التوصيل:', error);
        return throwError(() => new Error('فشل جلب البيانات'));
      })
    );
  }

  // حذف محطة توصيل
  deleteDeliveryStation(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }

    const url = `${this.baseUrl}/api/Dashboard/deliveryStation/${id}`;

    return this.http
      .delete<string>(url, {
        headers,
        responseType: 'text' as 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المحطة ${id}:`, error);
          return throwError(() => new Error(`فشل حذف المحطة ${id}`));
        })
      );
  }

  // إضافة محطة توصيل جديدة
  addDeliveryStation(body: {
    name: string;
  }): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });

    const url = `${this.baseUrl}/api/Dashboard/addDeliveryStation`;

    return this.http
      .post(url, body, {
        headers,
        responseType: 'text', // ← مهم جدًا: نعامل الـ response كنص
      })
      .pipe(
        map((textResponse: string) => {
          // أي نص يرجع من الباك = نجاح
          return {
            success: true,
            message: textResponse.trim() || 'تم إضافة المحطة بنجاح',
          };
        }),
        catchError((error) => {
          let msg = 'فشل إضافة المحطة';
          if (error.error && typeof error.error === 'string') {
            msg = error.error.trim();
          } else if (error.message) {
            msg = error.message;
          }
          console.error('خطأ في إضافة المحطة:', error);
          return of({
            // ← نرجع نفس الشكل حتى في حالة الخطأ
            success: false,
            message: msg,
          });
        })
      );
  }
}
