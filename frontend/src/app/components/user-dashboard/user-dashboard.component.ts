import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  books: any[] = [];
  filteredBooks: any[] = [];
  searchTerm: string = '';
  selectedGenre: string = 'All';

  genres: string[] = [
    'All',
    'self improvement',
    'motivational',
    'Art of Strategy',
    'science & fiction',
    'Romance',
    'Fiction',
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5050/user/books').subscribe(data => {
      this.books = data;
      this.filteredBooks = data;
      this.filterBooks();
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  filterBooks() {
  const search = this.searchTerm.toLowerCase();
  const genre = this.selectedGenre.toLowerCase();

  this.filteredBooks = this.books.filter(book => {
    const titleMatch = book.title?.toLowerCase().includes(search);

    let bookGenres: string[] = [];

    if (Array.isArray(book.genre)) {
      bookGenres = book.genre.map((g: string) => g.toLowerCase());
    } else if (typeof book.genre === 'string') {
      bookGenres = [book.genre.toLowerCase()];
    }

    const genreMatch = genre === 'all' || bookGenres.includes(genre);

    return titleMatch && genreMatch;
  });
}


  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
