// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log("Hi")
  console.log(auth.isLoggedIn$);
  return auth.isLoggedIn$ ? true : router.navigate(['/login']);
};
