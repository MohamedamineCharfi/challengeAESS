import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartConfiguration } from 'chart.js';

import { SatelliteDataService, Satellite } from '../services/satellite-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatProgressBarModule,
    MatBadgeModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  satellites$: any;
  metrics$: any;
  trendData$: any;

  trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'TSURU',
        data: [],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'UGUISU',
        data: [],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'NEPALISAT',
        data: [],
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'RAAVANA',
        data: [],
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  trendChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#e6eef8',
          font: { size: 12 } as any
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#e6eef8' } as any,
        grid: { color: 'rgba(255, 255, 255, 0.1)' } as any
      } as any,
      x: {
        ticks: { color: '#e6eef8' } as any,
        grid: { color: 'rgba(255, 255, 255, 0.1)' } as any
      } as any
    }
  };

  donutCharts: { [key: string]: ChartConfiguration<'doughnut'>['data'] } = {};
  donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#e6eef8' }
      }
    }
  };

  constructor(private dataService: SatelliteDataService) {
    this.satellites$ = this.dataService.getSatellites();
    this.metrics$ = this.dataService.getMetrics();
    this.trendData$ = this.dataService.getTrendData();
  }

  ngOnInit(): void {
    this.trendData$.subscribe((data: any) => {
      this.trendChartData.labels = data.map((d: any) => d.timestamp);
      this.trendChartData.datasets[0].data = data.map((d: any) => d.TSURU);
      this.trendChartData.datasets[1].data = data.map((d: any) => d.UGUISU);
      this.trendChartData.datasets[2].data = data.map((d: any) => d.NEPALISAT);
      this.trendChartData.datasets[3].data = data.map((d: any) => d.RAAVANA);
    });

    this.satellites$.subscribe((satellites: any) => {
      satellites.forEach((sat: any) => {
        this.donutCharts[sat.id] = {
          labels: ['Health', 'Remaining'],
          datasets: [
            {
              data: [sat.health, 100 - sat.health],
              backgroundColor: [this.getHealthColor(sat.health), 'rgba(255, 255, 255, 0.05)'],
              borderColor: '#0f172a',
              borderWidth: 2
            }
          ]
        };
      });
    });
  }

  getHealthColor(health: number): string {
    if (health >= 75) return '#16a34a';
    if (health >= 50) return '#f59e0b';
    if (health >= 30) return '#f97316';
    return '#ef4444';
  }

  getStatusBadgeClass(status: string): string {
    return `badge-${status}`;
  }

  getMetricsForSatellite(sat: Satellite): { name: string; value: number; color: string }[] {
    return [
      { name: 'Power', value: sat.power, color: this.getHealthColor(sat.power) },
      { name: 'Temperature', value: 100 - Math.abs(sat.temperature - 25) * 2, color: '#60a5fa' },
      { name: 'Data TX', value: sat.dataTransmission, color: this.getHealthColor(sat.dataTransmission) }
    ];
  }
}
