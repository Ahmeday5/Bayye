import { Component, OnInit, AfterViewInit, HostBinding } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // إضافة CommonModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule], // إضافة RouterModule لدعم routerLink و routerLinkActive
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
// حالة السايدبار في الموبايل (مفتوح أو مغلق)
  isMobileSidebarOpen: boolean = false;

  // حالة التصغير في الديسكتوب (آيقونات فقط)
  isMiniSidebar: boolean = false;

  // حقن Router و AuthService
  constructor(private authService: AuthService, private router: Router) {}

  // التهيئة عند تحميل الكومبوننت
  ngOnInit(): void {
    // عند تحميل الصفحة: إذا كان ديسكتوب → نبدأ بوضع كامل (غير مصغر)
    this.updateSidebarState();
  }

  // بعد تحميل العرض
  ngAfterViewInit(): void {
    // تحديث الحالة عند تغيير حجم الشاشة
    window.addEventListener('resize', () => this.updateSidebarState());
  }

  @HostBinding('style.--sidebar-width')
  get sidebarWidth(): string {
    if (this.isMiniSidebar && window.innerWidth >= 993) {
      return '70px';
    }
    return '250px'; // أو 17vw لو عايز، بس 250px أفضل وأدق
  }

  // فتح/قفل الـ Sidebar
  toggleSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  // دالة لتحديد حالة السايدبار بناءً على حجم الشاشة
  private updateSidebarState(): void {
    const isDesktop = window.innerWidth >= 993;
    this.isMobileSidebarOpen = isDesktop ? true : false; // في الديسكتوب دايمًا مفتوح
    if (!isDesktop) {
      this.isMiniSidebar = false; // الموبايل ما يستخدمش التصغير
    }
  }

  // فتح وإغلاق السايدبار في الموبايل فقط
  toggleMobileSidebar(): void {
    if (window.innerWidth <= 992) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    }
  }

  // تصغير وتكبير السايدبار في الديسكتوب فقط
  toggleMiniSidebar(): void {
    if (window.innerWidth >= 993) {
      this.isMiniSidebar = !this.isMiniSidebar;
    }
  }

  // عند الضغط على أي عنصر في القايمة (في الموبايل بس يتقفل)
  onMenuItemClick(): void {
    if (window.innerWidth <= 992) {
      this.isMobileSidebarOpen = false; // إغلاق تلقائي في الموبايل
    }
  }

  // تحديد إذا كان الرابط نشط
  isActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  // قائمة العناصر في الـ Sidebar
  menuItems = [
    {
      label: 'الرئيسية',
      path: '/dashboard',
      iconActive: 'fas fa-home fa-xl',
      iconInactive: 'fas fa-home fa-xl',
    },
    {
      label: 'الطلبيات',
      path: '/allorders',
      iconActive: 'fas fa-shopping-bag fa-xl',
      iconInactive: 'fas fa-shopping-bag fa-xl',
    },
    {
      label: 'المنتجات',
      path: '/Products',
      iconActive: 'fa-solid fa-cart-shopping fa-lg',
      iconInactive: 'fa-solid fa-cart-shopping fa-lg',
    },
    {
      label: 'الموردين',
      path: '/suppliers',
      iconActive: 'fas fa-truck fa-xl',
      iconInactive: 'fas fa-truck fa-xl',
    },
    {
      label: 'جميع المشترين',
      path: '/all-Buyers',
      iconActive: 'fas fa-users fa-xl',
      iconInactive: 'fas fa-users fa-xl',
    },
    {
      label: 'محطات توصيل السائقين',
      path: '/DeliverStation',
      iconActive: 'fas fa-truck fa-xl',
      iconInactive: 'fas fa-truck fa-xl',
    },
    {
      label: 'الأدمن',
      path: '/admins',
      iconActive: 'fas fa-users-cog fa-xl',
      iconInactive: 'fas fa-users-cog fa-xl',
    },
    {
      label: 'كشف حساب',
      path: '/all-supplierStatement',
      iconActive: 'fas fa-file-invoice-dollar fa-xl',
      iconInactive: 'fas fa-file-invoice-dollar fa-xl',
    },
    {
      label: 'الإعلانات',
      path: '/advertisements',
      iconActive: 'fas fa-bullhorn fa-xl',
      iconInactive: 'fas fa-bullhorn fa-xl',
    },
    {
      label: 'اكواد الدعوة',
      path: '/InvationCode',
      iconActive: 'fas fa-link fa-xl',
      iconInactive: 'fas fa-link fa-xl',
    },
  ];
}
