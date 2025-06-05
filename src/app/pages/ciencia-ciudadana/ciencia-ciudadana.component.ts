import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InaturalistService } from '../../services/inaturalist.service';
import { FormsModule } from '@angular/forms'; // <-- IMPORTAR ESTO


import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-ciencia-ciudadana',
  templateUrl: './ciencia-ciudadana.component.html',
  styleUrls: ['./ciencia-ciudadana.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
     FormsModule
  ]
})
export class CienciaCiudadanaComponent implements OnInit {
  observaciones: any[] = [];
  cargando: boolean = true;
  filtroCodigoPlanta: string = ''; // <-- NUEVO

  constructor(private inatService: InaturalistService) { }

  ngOnInit(): void {
    this.inatService.getAllObservations().subscribe({
      next: (data) => {
        this.observaciones = data.sort((a, b) => {
          const codigoA = this.obtenerCodigoPlanta(a.ofvs).toLowerCase();
          const codigoB = this.obtenerCodigoPlanta(b.ofvs).toLowerCase();

          const comparacionCodigo = codigoA.localeCompare(codigoB);
          if (comparacionCodigo !== 0) return comparacionCodigo;

          const fechaA = new Date(a.observed_on || a.created_at);
          const fechaB = new Date(b.observed_on || b.created_at);
          return fechaB.getTime() - fechaA.getTime();
        });

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar observaciones', err);
        this.cargando = false;
      }
    });
  }

  // NUEVO: método para filtrar observaciones por código de planta
  observacionesFiltradas() {
    return this.observaciones.filter(obs => {
      const codigo = this.obtenerCodigoPlanta(obs.ofvs)?.toLowerCase() || '';
      return codigo.includes(this.filtroCodigoPlanta.toLowerCase());
    });
  }

  obtenerCodigoPlanta(ofvs: any[]): string {
    const codigo = ofvs?.find(o => o.name === 'código de planta');
    return codigo?.value || 'No disponible';
  }

  obtenerLatitud(location: string): string {
    return location?.split(',')[0] || 'No disponible';
  }

  obtenerLongitud(location: string): string {
    return location?.split(',')[1] || 'No disponible';
  }

  obtenerNombreUsuario(obs: any): string {
    return obs?.user?.name || obs?.user?.login || 'No disponible';
  }

  exportarCSV(): void {
    const encabezados = [
      'Código de planta',
      'Latitud',
      'Longitud',
      'Observador',
      'Nombre planta',
      'Tiene hojas',
      'Tiene flores',
      'Tiene frutos',
      'Descripción original'
    ];

    const filas = this.observaciones.map(obs => {
      const codigo = this.obtenerCodigoPlanta(obs.ofvs);
      const lat = this.obtenerLatitud(obs.location);
      const lon = this.obtenerLongitud(obs.location);
      const observador = this.obtenerNombreUsuario(obs);
      const nombrePlanta = obs.species_guess || 'Sin nombre';
      const descripcionOriginal = obs.description || '';

      const desc = descripcionOriginal
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\n/g, ' ')
        .trim();

      const evaluarPresencia = (campo: string): string => {
        const sinTilde = campo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const regexEtiquetaValor = new RegExp(`${sinTilde}\\s*:\\s*(si|no)`, 'i');
        const resultadoEtiquetaValor = desc.match(regexEtiquetaValor);
        if (resultadoEtiquetaValor) {
          return resultadoEtiquetaValor[1].toLowerCase() === 'si' ? 'Sí' : 'No';
        }

        if (desc.includes(`no presenta ${sinTilde}`)) return 'No';
        if (desc.includes(`presenta ${sinTilde}`)) return 'Sí';
        if (desc.includes(`no tiene ${sinTilde}`)) return 'No';
        if (desc.includes(`tiene ${sinTilde}`)) return 'Sí';

        return 'No';
      };

      const tieneHojas = evaluarPresencia('hojas');
      const tieneFlores = evaluarPresencia('flores');
      const tieneFrutos = evaluarPresencia('frutos');

      return [
        codigo,
        lat.toString().replace('.', ','),
        lon.toString().replace('.', ','),
        observador,
        nombrePlanta,
        tieneHojas,
        tieneFlores,
        tieneFrutos,
        descripcionOriginal.replace(/"/g, '""')
      ];
    });

    const contenidoCSV = [encabezados, ...filas]
      .map(fila =>
        fila
          .map(valor => `"${valor}"`)
          .join(';')
      )
      .join('\n');

    const blob = new Blob(["\uFEFF" + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'observaciones_fenotropic.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
