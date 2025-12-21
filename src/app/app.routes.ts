import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllOrdersComponent } from './components/headerOrders/all-orders/all-orders.component';
import { OrdersComponent } from './components/headerOrders/orders/orders.component';
import { OrderItemsComponent } from './components/headerOrders/order-items/order-items.component';
import { ReturnsComponent } from './components/headerOrders/returns/returns.component';
import { ReturnItemsComponent } from './components/headerOrders/return-items/return-items.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { AlladvertisementsComponent } from './components/advertisements/alladvertisements/alladvertisements.component';
import { EditadvertisementsComponent } from './components/advertisements/editadvertisements/editadvertisements.component';
import { AddadvertisementsComponent } from './components/advertisements/addadvertisements/addadvertisements.component';
import { AllSupplierComponent } from './components/Suppliers/all-supplier/all-supplier.component';
import { ActiveSuppliersComponent } from './components/Suppliers/active-suppliers/active-suppliers.component';
import { InactiveSuppliersComponent } from './components/Suppliers/inactive-suppliers/inactive-suppliers.component';
import { SuppliersComponent } from './components/Suppliers/suppliers.component';
import { EditSupplierComponent } from './components/Suppliers/edit-supplier/edit-supplier.component';
import { AddSupplierComponent } from './components/Suppliers/add-supplier/add-supplier.component';
import { BuyersComponent } from './components/buyerss/noActiveBuyers/buyers.component';
import { BuyerssComponent } from './components/buyerss/buyerss.component';
import { AllBuyersComponent } from './components/buyerss/all-buyers/all-buyers.component';
import { EditBuyerComponent } from './components/buyerss/edit-buyer/edit-buyer.component';
import { AddBuyersComponent } from './components/buyerss/add-buyers/add-buyers.component';
import { AdminsComponent } from './components/admins/admins.component';
import { AllAdminComponent } from './components/admins/all-admin/all-admin.component';
import { AdminByIdComponent } from './components/admins/admin-by-id/admin-by-id.component';
import { UpdateAdminComponent } from './components/admins/update-admin/update-admin.component';
import { AddAdminComponent } from './components/admins/add-admin/add-admin.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { ProductsComponent } from './components/products/products.component';
import { AllProductComponent } from './components/products/all-product/all-product.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { DeliveryStationComponent } from './components/delivery-station/delivery-station.component';
import { AddDeliverStationComponent } from './components/delivery-station/add-deliver-station/add-deliver-station.component';
import { GetAllDeliverStationComponent } from './components/delivery-station/get-all-deliver-station/get-all-deliver-station.component';

export const canActivate: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return router.createUrlTree(['/login']);
      }
      return true;
    })
  );
};

export const canActivateRole: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data['allowedRoles'] as string[]) || [];

  return authService.role$.pipe(
    map((role) => {
      if (!role || !allowedRoles.some((r) => role.includes(r))) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    })
  );
};

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        return authService.isLoggedIn$.pipe(
          map((isLoggedIn) => {
            if (isLoggedIn) {
              return router.createUrlTree(['/dashboard']);
            }
            return true;
          })
        );
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الرئيسية' },
  },
  {
    path: 'allorders',
    component: AllOrdersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الطلبيات' },
  },
  {
    path: 'order',
    component: OrdersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الطلبيات' },
  },
  {
    path: 'order-items',
    component: OrderItemsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تفاصيل الطلبية' },
  },
  {
    path: 'return',
    component: ReturnsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'المرتجعات' },
  },
  {
    path: 'return-items',
    component: ReturnItemsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تفاصيل المرتجع' },
  },
  {
    path: 'advertisements',
    component: AdvertisementsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الاعلانات' },
  },
  {
    path: 'all-advertisement',
    component: AlladvertisementsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الاعلانات' },
  },
  {
    path: 'edit-advertisement/:id',
    component: EditadvertisementsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل اعلان' },
  },
  {
    path: 'add-advertisement',
    component: AddadvertisementsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة اعلان' },
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الموردين' },
  },
  {
    path: 'all-supplier',
    component: AllSupplierComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الموردين' },
  },
  {
    path: 'active-supplier',
    component: ActiveSuppliersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الموردين الناشطين' },
  },
  {
    path: 'inactive-supplier',
    component: InactiveSuppliersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الموردين غير الناشطين' },
  },
  {
    path: 'add-supplier',
    component: AddSupplierComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة مورد جديد' },
  },
  {
    path: 'edit-supplier/:id',
    component: EditSupplierComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل مورد' },
  },
  {
    path: 'all-Buyers',
    component: BuyerssComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع المشترين' },
  },
  {
    path: 'all-activeBuyers',
    component: AllBuyersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'المشترين الناشطين' },
  },
  {
    path: 'edit-buyer/:id',
    component: EditBuyerComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل مشتري' },
  },
  {
    path: 'all-inactiveBuyers',
    component: BuyersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'المشترين غير الناشطين' },
  },
  {
    path: 'add-buyer',
    component: AddBuyersComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة مشتري جديد' },
  },
  {
    path: 'admins',
    component: AdminsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الادمن' },
  },
  {
    path: 'all-admin',
    component: AllAdminComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الادمن' },
  },
  {
    path: 'edit-admin/:id',
    component: UpdateAdminComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل ادمن' },
  },
  {
    path: 'admin-details/:id',
    component: AdminByIdComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تفاصيل الادمن' },
  },
  {
    path: 'add-admin',
    component: AddAdminComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة ادمن' },
  },
  {
    path: 'all-supplierStatement',
    component: AccountStatementComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'كشف حساب المورد' },
  },
    {
    path: 'Products',
    component: ProductsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'المنتجات' },
  },
  {
    path: 'all-products',
    component: AllProductComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع المنتجات' },
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة منتج' },
  },
  {
    path: 'DeliverStation',
    component: DeliveryStationComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'محطات التوصيل' },
  },
  {
    path: 'add-DeliverStation',
    component: AddDeliverStationComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إضافة محطة توصيل' },
  },
  {
    path: 'All-DeliverStation',
    component: GetAllDeliverStationComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع محطات التوصيل' },
  },
  { path: '**', redirectTo: '' }, // لو المسار غلط، ارجع للرئيسية
];
