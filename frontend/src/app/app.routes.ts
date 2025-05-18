import { Routes } from '@angular/router';
import { BookDetailComponent } from './components/book-details/bookdetail.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'book/:id', component: BookDetailComponent },
  { path: '', component: AppComponent },
];
