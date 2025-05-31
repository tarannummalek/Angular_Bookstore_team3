import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { BookDetailComponent } from './components/book-details/bookdetail.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'add-book', component: AddBookComponent }, 
  { path: 'user-dashboard', component: UserDashboardComponent },
    { path: 'book/:id', component: BookDetailComponent },
    
  { path: '', redirectTo: '/user-dashboard', pathMatch: 'full' },

  // { path: 'login', component: LoginComponent }

];


