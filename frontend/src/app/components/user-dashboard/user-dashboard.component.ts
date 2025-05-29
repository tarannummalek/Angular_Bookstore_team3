import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';

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
currentSlide=0;
Object: any;
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}
  

  ngOnInit() {
    const token = localStorage.getItem('token');
  if (!token || !this.authService.getUserRole()) {
    this.router.navigate(['/login']);
    return;
  }

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
    this.router.navigate(['/login']);
   
  }
  redirectToBook(bookId: string) {
  this.router.navigate(['/book', bookId]);
}


categoryMap: { [key: string]: string[] } = {
  Motivational: [
    'The Temporary Wife',
    'Think & Grow Rich (Hindi)',
    'The 5 AM Club',
    'New Scientist',
    'Good Strategy/Bad Strategy'
  ],
  'Art of Strategy': [
    'Kauon Ka Hamla',
    'Ikigai | Hindi',
    'We Are Voulhire',
    'White Holes',
    'Mindset Makeover'
  ],
  'Science & Fiction': [
    'Between Death and Life',
    'The Power of Your Subconscious Min',
    'Atomic Habits',
    'The Theory Of Everything',
    'The Strategy Book'
  ],
  Romance: [
    'The Psychology of Persuasion',
    'The Law Of Attraction',
    'Dopamine Detox',
    'Relativity'
  ]
};


 filterBooks() {
  const search = this.searchTerm.toLowerCase();
  const genre = this.selectedGenre.toLowerCase();

  this.filteredBooks = this.books.filter(book => {
    const titleMatch = book.title?.toLowerCase().includes(search);

  
    let bookGenres: string[] = [];

    if (book.genre) {
      if (Array.isArray(book.genre)) {
        bookGenres = book.genre.map((g: any) => g?.toString().toLowerCase());
      } else if (typeof book.genre === 'string') {
        bookGenres = [book.genre.toLowerCase()];
      }
    }

    const genreMatch = genre === 'all' || bookGenres.includes(genre);
   console.log('Genre selected:', genre);
console.log('Book genres:', bookGenres);
console.log('Book:', book.title, '| Genres:', bookGenres);

    return titleMatch && genreMatch;
  });
}
selectedCategory: string = 'All';

showAllBooks() {
  this.selectedCategory = 'All';
  this.filteredBooks = [...this.books]; 
}
filterByCategory(genre: string) {
  this.selectedCategory = genre;
  const titles = this.categoryMap[genre];
  this.filteredBooks = this.books.filter(book =>
    titles.includes(book.title)
  );
}
getCategoryKeys(): string[] {
  return Object.keys(this.categoryMap || {});
}

 

  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
