import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Satellite {
  id: string;
  name: string;
  health: number;
  status: 'operational' | 'degraded' | 'at-risk' | 'critical';
  lastUpdate: Date;
  temperature: number;
  power: number;
  dataTransmission: number;
  systems: { name: string; status: number }[];
}

export interface DashboardMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TrendData {
  timestamp: string;
  TSURU: number;
  UGUISU: number;
  NEPALISAT: number;
  RAAVANA: number;
}

@Injectable({
  providedIn: 'root'
})
export class SatelliteDataService {
  private satellites: Satellite[] = [
    {
      id: 'sat-001',
      name: 'TSURU',
      health: 85,
      status: 'operational',
      lastUpdate: new Date(Date.now() - 5 * 60000),
      temperature: 28,
      power: 92,
      dataTransmission: 87,
      systems: [
        { name: 'Power Supply', status: 95 },
        { name: 'Thermal Control', status: 82 },
        { name: 'Communication', status: 88 },
        { name: 'Propulsion', status: 79 },
      ]
    },
    {
      id: 'sat-002',
      name: 'UGUISU',
      health: 90,
      status: 'operational',
      lastUpdate: new Date(Date.now() - 3 * 60000),
      temperature: 25,
      power: 96,
      dataTransmission: 93,
      systems: [
        { name: 'Power Supply', status: 98 },
        { name: 'Thermal Control', status: 89 },
        { name: 'Communication', status: 91 },
        { name: 'Propulsion', status: 85 },
      ]
    },
    {
      id: 'sat-003',
      name: 'NEPALISAT',
      health: 70,
      status: 'degraded',
      lastUpdate: new Date(Date.now() - 8 * 60000),
      temperature: 32,
      power: 72,
      dataTransmission: 65,
      systems: [
        { name: 'Power Supply', status: 68 },
        { name: 'Thermal Control', status: 70 },
        { name: 'Communication', status: 72 },
        { name: 'Propulsion', status: 60 },
      ]
    },
    {
      id: 'sat-004',
      name: 'RAAVANA',
      health: 60,
      status: 'at-risk',
      lastUpdate: new Date(Date.now() - 12 * 60000),
      temperature: 38,
      power: 55,
      dataTransmission: 48,
      systems: [
        { name: 'Power Supply', status: 50 },
        { name: 'Thermal Control', status: 62 },
        { name: 'Communication', status: 55 },
        { name: 'Propulsion', status: 45 },
      ]
    }
  ];

  private trendData: TrendData[] = [
    { timestamp: '12:00 PM', TSURU: 87, UGUISU: 92, NEPALISAT: 72, RAAVANA: 65 },
    { timestamp: '1:00 PM', TSURU: 86, UGUISU: 91, NEPALISAT: 71, RAAVANA: 62 },
    { timestamp: '2:00 PM', TSURU: 85, UGUISU: 90, NEPALISAT: 70, RAAVANA: 60 },
    { timestamp: '3:00 PM', TSURU: 84, UGUISU: 89, NEPALISAT: 69, RAAVANA: 58 },
  ];

  private satellitesSubject = new BehaviorSubject<Satellite[]>(this.satellites);
  public satellites$ = this.satellitesSubject.asObservable();

  private metricsSubject = new BehaviorSubject<DashboardMetric[]>(this.generateMetrics());
  public metrics$ = this.metricsSubject.asObservable();

  private trendDataSubject = new BehaviorSubject<TrendData[]>(this.trendData);
  public trendData$ = this.trendDataSubject.asObservable();

  constructor() {
    // Simulate real-time updates every 10 seconds
    setInterval(() => this.updateSatelliteData(), 10000);
  }

  private updateSatelliteData(): void {
    this.satellites.forEach(sat => {
      const variance = (Math.random() - 0.5) * 4;
      sat.health = Math.max(0, Math.min(100, sat.health + variance));
      sat.lastUpdate = new Date();

      // Update status based on health
      if (sat.health >= 75) sat.status = 'operational';
      else if (sat.health >= 50) sat.status = 'degraded';
      else if (sat.health >= 30) sat.status = 'at-risk';
      else sat.status = 'critical';
    });

    this.satellitesSubject.next([...this.satellites]);
    this.metricsSubject.next(this.generateMetrics());
  }

  private generateMetrics(): DashboardMetric[] {
    const avgHealth = this.satellites.reduce((sum, s) => sum + s.health, 0) / this.satellites.length;
    const operational = this.satellites.filter(s => s.status === 'operational').length;

    return [
      { label: 'Fleet Health', value: Math.round(avgHealth), unit: '%', trend: 'stable' },
      { label: 'Operational', value: operational, unit: 'of 4', trend: 'up' },
      { label: 'Active Signals', value: this.satellites.filter(s => s.dataTransmission > 50).length, unit: 'satellites', trend: 'stable' },
      { label: 'Avg Power Usage', value: Math.round(this.satellites.reduce((sum, s) => sum + s.power, 0) / this.satellites.length), unit: '%', trend: 'down' }
    ];
  }

  getSatellites(): Observable<Satellite[]> {
    return this.satellites$;
  }

  getMetrics(): Observable<DashboardMetric[]> {
    return this.metrics$;
  }

  getTrendData(): Observable<TrendData[]> {
    return this.trendData$;
  }

  getSatelliteById(id: string): Observable<Satellite | undefined> {
    return new Observable(observer => {
      const satellite = this.satellites.find(s => s.id === id);
      observer.next(satellite);
      observer.complete();
    });
  }
}
