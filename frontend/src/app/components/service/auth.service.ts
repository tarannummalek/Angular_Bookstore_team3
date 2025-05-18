// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  // Check if token exists
 isLoggedIn$ = this.loggedIn.asObservable();
 login(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true); // Notify subscribers that login status changed
  }
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false); // Notify subscribers that user logged out
  }

  // Decode JWT payload safely
  private getTokenPayload(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch (err) {
      console.error('Error decoding token', err);
      return null;
    }
  }

  // Get user role from token payload
  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    return payload?.role || null;
  }

  // Optional: Get username from token payload
  getUsername(): string | null {
    const payload = this.getTokenPayload();
    return payload?.username || null;
  }

}
