import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import {NotFound} from "./components/notfoundpage.component";
import {LoginForm} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component"
import {authGuard} from "./components/gaurds/auth.guard"
import {roleGuard} from "./components/gaurds/role.guard"
import { ViewCommentComponent } from './components/view-comment/view-comment.component';
export const routes: Routes = [
  { path: 'admin',canActivate:[authGuard,roleGuard], component: AdminComponent,data:{role:"Admin"} },
  { path: 'add-book',canActivate:[authGuard,roleGuard], component: AddBookComponent,data:{role:"Admin"} },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: 'books/:bookId/comments',canActivate:[authGuard],component: ViewCommentComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginForm},
  {path:"**",component:NotFound}
];


