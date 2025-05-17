import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {path:'register',component:RegisterComponent}
];


