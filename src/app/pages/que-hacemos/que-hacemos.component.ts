import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component'; 
import { FooterComponent } from '../../components/footer/footer.component'; 

@Component({
  selector: 'app-que-hacemos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './que-hacemos.component.html',
})
export class QueHacemosComponent {}
