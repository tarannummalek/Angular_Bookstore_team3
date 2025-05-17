import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  showGenre = true;
  showPrice = true;

  booksOnPage: any = [];
  booksPerPage = 6;
  currentPage = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5050/books').subscribe((data: any) => {
      this.books = data;
      this.applySearch();
      console.log('Success', data);
    });
  }
  onSearchHandler() {
    this.currentPage = 1;
    this.applySearch();
  }
  applySearch() {
    let term = this.searchTerm.trim().toLowerCase();

    this.filteredBooks = this.books.filter(
      (book: any) =>!term || (book.title && book.title.toLowerCase().includes(term)) || (book.author && book.author.toLowerCase().includes(term)) ||
        (book.keywords && book.keywords.join(' ').toLowerCase().includes(term))
    );
    
    this.setBooksOnPage();
  }

  setBooksOnPage() {
    let first = (this.currentPage - 1) * this.booksPerPage;
    this.booksOnPage = this.filteredBooks.slice(first, first + this.booksPerPage);
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
    if (confirm('Are you sure you want to delete this book?')) {
      this.http.delete(`http://localhost:5050/books/${id}`).subscribe(() => {
        this.books = this.books.filter((book: any) => book._id !== id);
        this.applySearch();
      });
    }
  }
}
