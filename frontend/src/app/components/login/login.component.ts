import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {AuthService} from "../service/auth.service"
@Component({
  template: `
    <div class="container">
      <h2>Login</h2>

      <!-- Display General Error Message -->
      <div *ngIf="generalError" class="alert alert-danger">
        {{ generalError }}
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            id="email"
            class="form-control"
            formControlName="email"
            [class.is-invalid]="loginForm.get('email')?.invalid && (loginForm.get('email')?.touched || submitted)"
          />
          <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required']">
            Email is required.
          </div>
          <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email']">
            Please enter a valid email address.
          </div>
                   <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['notComDomain']">
            Emails which ends with .com only are allowed
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            formControlName="password"
            [class.is-invalid]="loginForm.get('password')?.invalid && (loginForm.get('password')?.touched || submitted)"
          />
          <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required']">
            Password is required.
          </div>
          <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['minlength']">
            Password must be at least 6 characters long.
          </div>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid">
          Login
        </button>
      </form>
    </div>
  `,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, HttpClientModule],
  selector: "login",
  providers:[],
  standalone: true
})
export class LoginForm {
  loginForm: FormGroup;
  submitted = false;
  generalError: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,private authService:AuthService


  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email,this.comEmailValidator]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }
  comEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // Skip validation if empty — let required validator handle it
  const isValid = value.endsWith('.com');
  return isValid ? null : { notComDomain: true };
}
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.generalError = null; // Reset the general error message on submit
    console.log(this.loginForm.value)
    if (this.loginForm.invalid) {
      return;
    }



    this.http.post("http://localhost:5050/users/login", this.loginForm.value).subscribe({
      next: (data: any) => {
        console.log(data);
        this.authService.login(data["token"]);
        localStorage.setItem("username",this.loginForm.value.email)
        this.loginForm.reset();
        if(this.authService.getUserRole()==="Admin"){
          this.router.navigate(["/admin"])
        }
        else{
          this.router.navigate(["/user"])
        }

      },
      error: (e) => {
        if(e.status===404){
          this.generalError= "User Not Found"
        }
       else if (e.status === 400) {
          this.generalError = "Plese Enter The Proper Credentials."; // Set general error for 401
        }
        else if(e.status===401){
          this.generalError="Enter The Correct Password"
        }
        else {
          console.error(e);
          this.generalError = "Error occurred while logging in. Please try again."; // Set general error for other errors
        }
        console.log("Error While Submitting The Form");
      },
    });
  }
}
