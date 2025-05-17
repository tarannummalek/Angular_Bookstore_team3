import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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

  sortBy: string = '';

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

  toggleGenre(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if(index > -1)
      this.selectedGenres.splice(index, 1);
    else
      this.selectedGenres.push(genre);

    this.applySearch();
  }

  togglePriceRange(range: string) {
    const index = this.selectedPriceRanges.indexOf(range);
    if(index > -1)
      this.selectedPriceRanges.splice(index, 1);
    else
      this.selectedPriceRanges.push(range);

      this.applySearch();
  }

  applySearch() {
    let term = this.searchTerm.trim().toLowerCase();

    this.filteredBooks = this.books.filter((book: any) => {
      const matchesSearch = !term || 
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.keywords && book.keywords.toLowerCase().includes(term));

      const matchesGenre = this.selectedGenres.length === 0 ||
        (book.genre&& this.selectedGenres.includes(book.genre));

      const matchesPrice = this.selectedPriceRanges.length === 0 ||
        (this.selectedPriceRanges.some((range) => {
          const price  = Number(book.price);
          if(range === '0-100')
            return price >= 0 && price <=100;
          if(range === '100-299')
            return price >=100 && price <=299;
          if(range === '299-450')
            return price >=299 && price <=450;
          if(range === '450+')
            return price >=450;

          return false; 
        }));
      return matchesSearch && matchesGenre && matchesPrice;
    });

    if(this.sortBy === 'english') {
      this.filteredBooks = this.filteredBooks.filter((book: any) => {
        book.language?.toLowerCase() === 'english';
      });
    }
    else if(this.sortBy === 'hindi'){
      this.filteredBooks = this.filteredBooks.filter((book: any) => {
        book.language?.toLowerCase() === 'hindi';
      });
    }
    // else if(this.sortBy === 'yearAsc') {
    //   this.filteredBooks = this.filteredBooks.sort((a: any, b: any) => a.year - b.year);
    // }
    // else if(this.sortBy === 'yearDesc') {
    //   this.filteredBooks = this.filteredBooks.sort((a: any, b: any) => b.year - a.year);
    // }

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
