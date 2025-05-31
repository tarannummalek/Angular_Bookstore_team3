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

sliderImages = [
  'assets/1.png',
  'assets/2.png',
  'assets/3.png',
  'assets/4.png',
  'assets/5.png',
  'assets/6.png'
];
currentSlide = 0;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5050/user/books').subscribe(data => {
      this.books = data;
      this.filteredBooks = data;
      this.filterBooks();
    });
    setInterval(() => {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }, 10000); 
  }

  redirectToLogin() {
    // this.router.navigate(['/login']);
    this.router.navigate(['/book/682833218c7aa6e9080d1b29']);
  }
  redirectToBook(bookId: string) {
  this.router.navigate(['/book', bookId]);
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
