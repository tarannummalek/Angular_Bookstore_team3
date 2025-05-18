// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

 isLoggedIn$ = this.loggedIn.asObservable();
 login(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false); 
  }

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

  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    return payload?.role || null;
  }

  getUsername(): string | null {
    const payload = this.getTokenPayload();
    return payload?.username || null;
  }

}
