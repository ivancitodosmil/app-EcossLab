import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { InaturalistService } from '../../services/inaturalist.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-graficas-importantes',
  templateUrl: './graficas-importantes.component.html',
  styleUrls: ['./graficas-importantes.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    NavbarComponent,
    FooterComponent,
  ]
})
export class GraficasImportantesComponent implements OnInit {
  cargando = true;
  observaciones: any[] = [];

  // Gráficas utilizadas en el HTML
  usuariosLabels: string[] = [];
  usuariosData: number[] = [];

  mesesLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  mesesData: number[] = new Array(12).fill(0);

  estadoIdLabels: string[] = ['Identificado', 'No identificado'];
  estadoIdData: number[] = [0, 0];

  calidadLabels: string[] = ['Casual', 'Investigador', 'Confirmado'];
  calidadData: number[] = [0, 0, 0];

  chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  constructor(private inatService: InaturalistService) {}

  ngOnInit(): void {
    this.inatService.getAllObservations().subscribe({
      next: (data) => {
        this.observaciones = data;
        this.procesarDatos();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar observaciones', err);
        this.cargando = false;
      }
    });
  }

  obtenerNombreUsuario(obs: any): string {
    return obs?.user?.name || obs?.user?.login || 'No disponible';
  }

  obtenerMes(fechaStr: string): number {
    if (!fechaStr) return -1;
    const d = new Date(fechaStr);
    return isNaN(d.getMonth()) ? -1 : d.getMonth();
  }

  private procesarDatos(): void {
    const conteoUsuarios = new Map<string, number>();

    let countIdentificado = 0;
    let countNoIdentificado = 0;

    let countCasual = 0;
    let countInvestigador = 0;
    let countConfirmado = 0;

    for (const obs of this.observaciones) {
      // Usuario
      const usuario = this.obtenerNombreUsuario(obs);
      conteoUsuarios.set(usuario, (conteoUsuarios.get(usuario) || 0) + 1);

      // Fecha - mes
      const mesIdx = this.obtenerMes(obs.observed_on);
      if (mesIdx >= 0) this.mesesData[mesIdx]++;

      // Estado de identificación
      if (obs.taxon) countIdentificado++;
      else countNoIdentificado++;

      // Calidad de verificación
      switch (obs.quality_grade) {
        case 'casual': countCasual++; break;
        case 'needs_id': countInvestigador++; break;
        case 'research': countConfirmado++; break;
        default: break;
      }
    }

    // Top 10 usuarios
    const usuariosOrdenados = Array.from(conteoUsuarios.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    this.usuariosLabels = usuariosOrdenados.map(x => x[0]);
    this.usuariosData = usuariosOrdenados.map(x => x[1]);

    this.estadoIdData = [countIdentificado, countNoIdentificado];
    this.calidadData = [countCasual, countInvestigador, countConfirmado];
  }
}
