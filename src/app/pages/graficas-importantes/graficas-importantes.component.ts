// IMPORTS
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

import { InaturalistService } from '../../services/inaturalist.service';
import { DashboardService } from '../../services/dashboard.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

import {
  Chart,
  ChartOptions
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  selector: 'app-graficas-importantes',
  templateUrl: './graficas-importantes.component.html',
  styleUrls: ['./graficas-importantes.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ]
})
export class GraficasImportantesComponent implements OnInit {
  cargando = true;
  observaciones: any[] = [];
  datosPlantas: any[] = [];

  usuariosLabels: string[] = [];
  usuariosData: number[] = [];

  mesesLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  mesesData: number[] = new Array(12).fill(0);

  estadoIdLabels: string[] = ['Identificado', 'No identificado'];
  estadoIdData: number[] = [0, 0];

  calidadLabels: string[] = ['Casual', 'Investigador', 'Confirmado'];
  calidadData: number[] = [0, 0, 0];

  hojasLabels: string[] = ['Con hojas', 'Sin hojas'];
  hojasData: number[] = [0, 0];

  floresLabels: string[] = ['Con flores', 'Sin flores'];
  floresData: number[] = [0, 0];

  frutosLabels: string[] = ['Con frutos', 'Sin frutos'];
  frutosData: number[] = [0, 0];

  filtroInstitucion: string = '';
  filtroEspecie: string = '';
  institucionesUnicas: string[] = [];
  especiesUnicas: string[] = [];

  chartPlugins = [ChartDataLabels];

  chartOptionsDoughnut: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as const,
          size: 14
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const porcentaje = total > 0 ? (value / total * 100).toFixed(1) : '0';
          return `${porcentaje}%`;
        }
      }
    }
  };

  chartOptionsBar: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: '#FFFFFF',
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        formatter: (value: number) => `${value}`
      }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  constructor(
    private inatService: InaturalistService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.inatService.getAllObservations().subscribe({
      next: (data) => {
        this.observaciones = data;
        this.procesarDatosInat();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar observaciones', err);
        this.cargando = false;
      }
    });

    this.dashboardService.cargarCSVDesdeAssets('assets/datos/observaciones_fenotropic.csv').subscribe(data => {
      this.datosPlantas = data;
      this.institucionesUnicas = [...new Set(data.map(p => p['Institución educativa']).filter(Boolean))];
      this.actualizarEspeciesDisponibles();
      this.aplicarFiltrosCSV();
    });
  }

  actualizarEspeciesDisponibles(): void {
    const filtradas = this.filtroInstitucion
      ? this.datosPlantas.filter(p => p['Institución educativa'] === this.filtroInstitucion)
      : this.datosPlantas;

    this.especiesUnicas = [...new Set(filtradas.map(p => p['Especie']).filter(Boolean))];

    if (this.filtroEspecie && !this.especiesUnicas.includes(this.filtroEspecie)) {
      this.filtroEspecie = '';
    }
  }

  aplicarFiltrosCSV(): void {
    this.actualizarEspeciesDisponibles();

    const plantasFiltradas = this.datosPlantas.filter(p => {
      const coincideInst = this.filtroInstitucion ? p['Institución educativa'] === this.filtroInstitucion : true;
      const coincideEsp = this.filtroEspecie ? p['Especie'] === this.filtroEspecie : true;
      return coincideInst && coincideEsp;
    });

    this.procesarDatosCSV(plantasFiltradas);
  }

  private procesarDatosCSV(plantasFiltradas: any[]): void {
    let conHojas = 0, sinHojas = 0;
    let conFlores = 0, sinFlores = 0;
    let conFrutos = 0, sinFrutos = 0;

    for (const planta of plantasFiltradas) {
      planta['Tiene hojas']?.trim().toLowerCase() === 'sí' ? conHojas++ : sinHojas++;
      planta['Tiene flores']?.trim().toLowerCase() === 'sí' ? conFlores++ : sinFlores++;
      planta['Tiene frutos']?.trim().toLowerCase() === 'sí' ? conFrutos++ : sinFrutos++;
    }

    this.hojasData = [conHojas, sinHojas];
    this.floresData = [conFlores, sinFlores];
    this.frutosData = [conFrutos, sinFrutos];
  }

  private procesarDatosInat(): void {
    const conteoUsuarios = new Map<string, number>();
    let countIdentificado = 0;
    let countNoIdentificado = 0;
    let countCasual = 0;
    let countInvestigador = 0;
    let countConfirmado = 0;

    for (const obs of this.observaciones) {
      const usuario = this.obtenerNombreUsuario(obs);
      conteoUsuarios.set(usuario, (conteoUsuarios.get(usuario) || 0) + 1);

      const mesIdx = this.obtenerMes(obs.observed_on);
      if (mesIdx >= 0) this.mesesData[mesIdx]++;

      if (obs.taxon) countIdentificado++;
      else countNoIdentificado++;

      switch (obs.quality_grade) {
        case 'casual': countCasual++; break;
        case 'needs_id': countInvestigador++; break;
        case 'research': countConfirmado++; break;
      }
    }

    const usuariosOrdenados = Array.from(conteoUsuarios.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    this.usuariosLabels = usuariosOrdenados.map(x => x[0]);
    this.usuariosData = usuariosOrdenados.map(x => x[1]);

    this.estadoIdData = [countIdentificado, countNoIdentificado];
    this.calidadData = [countCasual, countInvestigador, countConfirmado];
  }

  obtenerNombreUsuario(obs: any): string {
    return obs?.user?.name || obs?.user?.login || 'No disponible';
  }

  obtenerMes(fechaStr: string): number {
    if (!fechaStr) return -1;
    const d = new Date(fechaStr);
    return isNaN(d.getMonth()) ? -1 : d.getMonth();
  }
}
