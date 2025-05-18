import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin-dashboard/admin.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { ViewCommentComponent } from './components/view-comment/view-comment.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'books/:bookId/comments', component: ViewCommentComponent},
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];


 