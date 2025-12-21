import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface CardStat {
  id: number;
  label: string;
  value: any;
  linkRef: string;
  iconCards: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  [x: string]: any;
  loading: boolean = false;
  errorMessage: string | null = null;
  cardStats: CardStat[] = [];
  ordersToday: any = '';
  ordersMonth: any = '';
  allCount: any = '';
  activeCount: any = '';
  inactiveCount: any = '';
  allsupplierCount: any = '';
  activesupplierCount: any = '';
  inactivesupplierCount: any = '';

  @ViewChild('ordersChart') ordersChartRef!: ElementRef;
  chart!: Chart;

  @ViewChild('buyersChart') buyersChartRef!: ElementRef;
  charts!: Chart;

  @ViewChild('suppliersChart') suppliersChartRef!: ElementRef;
  supplierchart!: Chart;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchStatsOrders();
  }

  fetchStatsOrders() {
    this.loading = true;
    this.errorMessage = null;

    forkJoin({
      allCount: this.apiService.getTotalBuyers(),
      activeCount: this.apiService.getTotalactiveBuyers(),
      inactiveCount: this.apiService.getTotalinactiveBuyers(),
      allsupplierCount: this.apiService.getTotalSuppliers(),
      activesupplierCount: this.apiService.getTotalActiveSuppliers(),
      inactivesupplierCount: this.apiService.getTotalinactiveSuppliers(),
      TotalOrdersToday: this.apiService.getTotalOrdersToday(),
      TotalOrderMonth: this.apiService.getTotalOrderMonth(),
    }).subscribe({
      next: (data) => {
        this.ordersToday = data.TotalOrdersToday.count || 0;
        this.ordersMonth = data.TotalOrderMonth.count || 0;
        this.allCount = data.allCount.count || 0;
        this.activeCount = data.activeCount.count || 0;
        this.inactiveCount = data.inactiveCount.count || 0;
        this.allsupplierCount = data.allsupplierCount.count || 0;
        this.activesupplierCount = data.activesupplierCount.count || 0;
        this.inactivesupplierCount = data.inactivesupplierCount.count || 0;
        const TotlaOrders = `${this.ordersToday} / ${this.ordersMonth}`;

        // هنا نرسم الـ Chart
        setTimeout(() => {
          this.renderOrdersChart(this.ordersToday, this.ordersMonth);
        });
        setTimeout(() => {
          this.buyersChart(this.allCount, this.activeCount, this.inactiveCount);
        });
        setTimeout(() => {
          this.suppliersChart(this.allsupplierCount, this.activesupplierCount, this.inactivesupplierCount);
        });

        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'فشل في جلب بيانات لوحة التحكم';
        console.error('مشكلة في جلب الـ Stats:', error);
        this.loading = false;
      },
    });
  }

  buyersChart(allCount: number, activeCount: number, inactiveCount: number) {
    const ctx = this.buyersChartRef.nativeElement.getContext('2d');

    if (this.charts) {
      this.charts.destroy(); // لو فيه شارت مرسوم قبل كده نلغيه
    }
    this.charts = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['جميع المشترين', 'المشترين الناشطين', 'المشترين غير الناشطين'],
        datasets: [
          {
            label: 'عدد المشترين',
            data: [allCount, activeCount, inactiveCount],
            backgroundColor: ['#667eea', '#ff6f61', '#4a90e2'], // الألوان الجديدة
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff', // تحديد لون الليبل إلى الأبيض
            },
          },
          title: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true, // بدء المحور Y من الصفر
            ticks: {
              color: '#ffffff', // لون النصوص في المحور Y
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // لون خطوط الشبكة
            },
          },
          x: {
            ticks: {
              color: '#ffffff', // لون النصوص في المحور X
            },
            grid: {
              display: false, // إخفاء خطوط الشبكة في المحور X
            },
          },
        },
      },
    });
  }

  suppliersChart(allsupplierCount: number, activesupplierCount: number, inactivesupplierCount: number) {
    const ctx = this.suppliersChartRef.nativeElement.getContext('2d');

    if (this.supplierchart) {
      this.supplierchart.destroy(); // لو فيه شارت مرسوم قبل كده نلغيه
    }
    this.supplierchart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['جميع الموردين', 'الموردين الناشطين', 'الموردين غير الناشطين'],
        datasets: [
          {
            label: 'عدد الموردين',
            data: [allsupplierCount, activesupplierCount, inactivesupplierCount],
            backgroundColor: ['#667eea', '#ff6f61', '#4a90e2'],
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff', // تحديد لون الليبل إلى الأبيض
            },
          },
          title: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff', // لون النصوص في المحور Y
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // لون خطوط الشبكة
            },
          },
          x: {
            ticks: {
              color: '#ffffff', // لون النصوص في المحور X
            },
            grid: {
              display: false, // إخفاء خطوط الشبكة في المحور X
            },
          },
        },
      },
    });
  }

  renderOrdersChart(ordersToday: number, ordersMonth: number) {
    const ctx = this.ordersChartRef.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy(); // لو فيه شارت مرسوم قبل كده نلغيه
    }
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['اليوم', 'الشهر'],
        datasets: [
          {
            label: 'عدد الطلبات',
            data: [ordersToday, ordersMonth],
            backgroundColor: ['#ffffff', '#ff7f00'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff', // تحديد لون الليبل إلى الأبيض
            },
          },
          title: {
            display: true,
          },
        },
      },
    });
  }
}
