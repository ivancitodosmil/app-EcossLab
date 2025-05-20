import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ IMPORTANTE para *ngIf y *ngFor
import { InaturalistService } from '../../services/inaturalist.service';

@Component({
  standalone: true, // ✅ obligatorio si no estás usando NgModule
  selector: 'app-ciencia-ciudadana',
  templateUrl: './ciencia-ciudadana.component.html',
  styleUrls: ['./ciencia-ciudadana.component.css'],
  imports: [CommonModule] // ✅ AQUI va el CommonModule para *ngIf y *ngFor
})
export class CienciaCiudadanaComponent implements OnInit {
  observaciones: any[] = [];
  cargando: boolean = true;

  constructor(private inatService: InaturalistService) {}

  ngOnInit(): void {
    this.inatService.getAllObservations().subscribe({
      next: (data) => {
        this.observaciones = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar observaciones', err);
        this.cargando = false;
      }
    });
  }
}
