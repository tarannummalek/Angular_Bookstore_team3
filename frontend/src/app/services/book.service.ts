import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5050/books';

  constructor(private http: HttpClient) {}

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
