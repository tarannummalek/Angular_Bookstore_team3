import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
})
export class AdminComponent {
  books: any = [];
  searchTerm: string = '';

  filteredBooks: any = [];
  selectedGenres: string[] = [];
  selectedPriceRanges: string[] = [];

  searchByBooks: any = [];
  priceByBooks: any = [];
  activeFilter: 'search' | 'price' | 'none' = 'none';

  showGenre = true;
  showPrice = true;

  booksOnPage: any = [];
  booksPerPage = 6;
  currentPage = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const headers = new HttpHeaders({
  'Authorization': 'Bearer '+localStorage.getItem("token") // Replace with your actual token
});

    this.http.get('http://localhost:5050/books',{headers}).subscribe((data: any) => {
      console.log(data)
      this.books = data;
      this.applySearchFilter();
      console.log('Success', data);
    });
  }
  onSearchHandler() {
    this.currentPage = 1;
    this.activeFilter = this.searchTerm.trim() ? 'search' : 'none';
    this.applySearchFilter();
  }

  togglePriceRange(range: string) {
    let index = this.selectedPriceRanges.indexOf(range);
    if (index > -1) this.selectedPriceRanges.splice(index, 1);
    else this.selectedPriceRanges.push(range);

    this.activeFilter = this.selectedPriceRanges.length ? 'price' : 'none';
    this.applyPriceFilter();
  }

  applySearchFilter() {
    let term = this.searchTerm.trim().toLowerCase();

    this.searchByBooks = this.books.filter(
      (book: any) =>
        !term ||
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.keywords && [].concat(book.keywords).some((kw: any) =>typeof kw === 'string' && kw.toLowerCase().includes(term)))
    );
    this.setBooksOnPage();
  }

  applyPriceFilter() {
    this.priceByBooks = this.books.filter(
      (book: any) =>
        this.selectedPriceRanges.length === 0 ||
        this.selectedPriceRanges.some((range) => {
          const price = Number(book.price);
          if (range === '0-100') return price >= 0 && price <= 100;
          if (range === '100-299') return price >= 100 && price <= 299;
          if (range === '299-450') return price >= 299 && price <= 450;
          if (range === '450+') return price >= 450;
          return false;
        })
    );
    this.setBooksOnPage();
  }

  setBooksOnPage() {
    let first = (this.currentPage - 1) * this.booksPerPage;
    let source =
      this.activeFilter === 'search'
        ? this.searchByBooks
        : this.activeFilter === 'price'
        ? this.priceByBooks
        : this.books;
    this.booksOnPage = source.slice(first, first + this.booksPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setBooksOnPage();
  }

  get totalPages() {
    return Math.ceil(this.books.length / this.booksPerPage);
  }

  get pages(): number[] {
    let array = [];
    for (let i = 1; i <= this.totalPages; i++) {
      array.push(i);
    }
    return array;
  }

  deleteBook(id: String) {
    const headers = new HttpHeaders({
  'Authorization': 'Bearer your_token_here' // Replace with your actual token
});

    if (confirm('Are you sure you want to delete this book?')) {
      this.http.delete(`http://localhost:5050/books/${id}`,{headers}).subscribe(() => {
        this.books = this.books.filter((book: any) => book._id !== id);
        this.applySearchFilter();
      });
    }
  }
}
