
import { Routes } from '@angular/router';

import { AdminComponent } from './components/admin-dashboard/admin.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { BookDetailComponent } from './components/book-details/bookdetail.component';
import { ViewCommentComponent } from './components/view-comment/view-comment.component';
import { NotFound } from './components/notfoundpage.component';
import { LoginForm } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { authGuard } from './components/gaurds/auth.guard';
import { roleGuard } from './components/gaurds/role.guard';

export const routes: Routes = [

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },

  
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'book/:id',
    component: BookDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'books/:bookId/comments',
    component: ViewCommentComponent,
    canActivate: [authGuard]
  },


  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginForm },

  
  { path: '', redirectTo: '/user-dashboard', pathMatch: 'full' },


  { path: '**', component: NotFound }
];
