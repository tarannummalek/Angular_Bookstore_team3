import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, CommonModule,RouterOutlet],
  template: `
     <h1>Book Store</h1>
    <a [routerLink]="['/book', '682833218c7aa6e9080d1b29']">Go to Book Detail</a> 
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
