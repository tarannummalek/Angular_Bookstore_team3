import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import {AuthService} from "./components/service/auth.service"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(private router: Router,public authService: AuthService){}
  logOut(){
    console.log("Hello")
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
  
  get isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

}
