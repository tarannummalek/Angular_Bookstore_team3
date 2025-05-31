import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-bookdetail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css'],
})
export class BookDetailComponent implements OnInit {
  book: any;
  bookId: string = '';
  loading: boolean = true; 

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,private router: Router,
  ) {}
  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookId) {
      this.loading = true;
      this.bookService.getBookById(this.bookId).subscribe((data) => {
        this.book = data;
        if (this.book?.coverImage?.data && this.book?.coverImageType) {
          const byteArray = new Uint8Array(this.book.coverImage.data);
          const base64String = this.arrayBufferToBase64(byteArray);
          this.book.coverImage = `data:${this.book.coverImageType};base64,${base64String}`;
        }
        this.loading = false;
      }, (err) => {
        console.error('Error loading book:', err);
        this.loading = false;
      });
  
      this.loadComments();
    }
  }
  
   redirectToUserDashboard() {
    this.router.navigate(['/user-dashboard']);
    
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < buffer.byteLength; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
  }

  getPdfUrl(pdf: any): string {
    if (pdf?.data && Array.isArray(pdf.data)) {
      const byteArray = new Uint8Array(pdf.data);
      const base64String = this.arrayBufferToBase64(byteArray);
      return `data:application/pdf;base64,${base64String}`;
    }
    if (typeof pdf === 'string') {
      if (pdf.startsWith('data:')) {
        return pdf;
      }
      return `data:application/pdf;base64,${pdf}`;
    }
    console.error('Unsupported PDF format:', pdf);
    return '';
  }

  downloadPdf(): void {
    const pdfUrl = this.getPdfUrl(this.book?.pdf);
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${this.book?.title || 'book'}.pdf`;
      link.click();
    }
  }


  comments: { author: string, text: string, date: Date }[] = [

  ];
  
  newComment: string = '';
  loadComments(): void {
    this.bookService.getComments(this.bookId).subscribe((data) => {
      this.comments = data;
    });
  }
  
  addComment(): void {
    const text = this.newComment.trim();
    if (text) {
      const comment = {
        author: localStorage.getItem("username") || 'Anonymous',
        text: text
      };
      this.bookService.addComment(this.bookId, comment).subscribe((newComment) => {
        this.comments.unshift(newComment);
        this.newComment = '';
      });
    }
  }
 
}
