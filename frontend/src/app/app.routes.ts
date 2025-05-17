import { Routes } from '@angular/router';
import { BookDetailComponent } from './components/book-details/bookdetail.component';

export const routes: Routes = [
  { path: 'book/:id', component: BookDetailComponent },
];
