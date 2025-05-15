import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Para routerLink
import { CommonModule } from '@angular/common';  // Para *ngIf

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [
    CommonModule, // 🔥 Necesario para *ngIf
    RouterModule  // 🔥 Necesario para routerLink y routerLinkActive
  ],
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
