import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { InaturalistService } from '../../services/inaturalist.service';

@Component({
  selector: 'app-ciencia-ciudadana',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './ciencia-ciudadana.component.html',
  styleUrls: ['./ciencia-ciudadana.component.css']
})
export class CienciaCiudadanaComponent implements OnInit {
  observaciones: any[] = [];

  showGrafica1 = false;
  showGrafica2 = false;
  showGrafica3 = false;

  especiesLabels: string[] = [];
  especiesData: number[] = [];

  usuariosLabels: string[] = [];
  usuariosData: number[] = [];

  mesesLabels: string[] = [];
  mesesData: number[] = [];

  constructor(private api: InaturalistService) {}

  ngOnInit() {
    this.api.getObservacionesFenotropic().subscribe((res) => {
      this.observaciones = res.results;
      console.log('📦 Datos API:', this.observaciones);
      this.generarDatos();
    });
  }

  generarDatos() {
    const especieConteo: { [clave: string]: number } = {};
    const usuarioConteo: { [clave: string]: number } = {};
    const conteoMeses: { [mes: string]: number } = {};

    for (let obs of this.observaciones) {
      const especie = obs.taxon?.preferred_common_name || 'Desconocida';
      const usuario = obs.user?.login || 'Anónimo';
      const fecha = new Date(obs.observed_on);
      const mes = fecha.toLocaleString('default', { month: 'long' });

      especieConteo[especie] = (especieConteo[especie] || 0) + 1;
      usuarioConteo[usuario] = (usuarioConteo[usuario] || 0) + 1;
      conteoMeses[mes] = (conteoMeses[mes] || 0) + 1;
    }

    this.especiesLabels = Object.keys(especieConteo);
    this.especiesData = Object.values(especieConteo);

    this.usuariosLabels = Object.keys(usuarioConteo).slice(0, 10);
    this.usuariosData = Object.values(usuarioConteo).slice(0, 10);

    this.mesesLabels = Object.keys(conteoMeses);
    this.mesesData = Object.values(conteoMeses);
  }

  toggleGrafica1() {
    this.showGrafica1 = !this.showGrafica1;
  }
  toggleGrafica2() {
    this.showGrafica2 = !this.showGrafica2;
  }
  toggleGrafica3() {
    this.showGrafica3 = !this.showGrafica3;
  }
}
