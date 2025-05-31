import { Component } from '@angular/core';
import { RouterLink,  } from '@angular/router';
import { RouterOutlet,Router } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import {AuthService} from "./components/service/auth.service"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule,RouterOutlet],
  templateUrl:'./app.component.html', 
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

}
