import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
@Component({
  template: `
  <div class="container">
    <h2>Register</h2>
  
    <div *ngIf="generalError" class="alert alert-danger">
      {{ generalError }}
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      
      <div class="mb-3">
        <label>First Name:</label>
        <input formControlName="firstName" class="form-control" [class.is-invalid]="f['firstName'].touched && f['firstName'].invalid" />
        <div *ngIf="f['firstName'].touched && f['firstName'].invalid" class="invalid-feedback">
          <small *ngIf="f['firstName'].errors?.['required']">First name is required.</small>
        </div>
      </div>

      <div class="mb-3">
        <label>Last Name:</label>
        <input formControlName="lastName" class="form-control" [class.is-invalid]="f['lastName'].touched && f['lastName'].invalid" />
        <div *ngIf="f['lastName'].touched && f['lastName'].invalid" class="invalid-feedback">
          <small *ngIf="f['lastName'].errors?.['required']">Last name is required.</small>
        </div>
      </div>

      <div class="mb-3">
        <label>Mobile:</label>
        <input formControlName="mobile" class="form-control" [class.is-invalid]="f['mobile'].touched && f['mobile'].invalid" />
        <div *ngIf="f['mobile'].touched && f['mobile'].invalid" class="invalid-feedback">
          <small *ngIf="f['mobile'].errors?.['required']">Mobile number is required.</small>
          <small *ngIf="f['mobile'].errors?.['pattern']">Enter a valid 10-digit mobile number.</small>
        </div>
      </div>

      <div class="mb-3">
        <label>Email:</label>
        <input formControlName="email" class="form-control" [class.is-invalid]="f['email'].touched && f['email'].invalid" />
        <div *ngIf="f['email'].touched && f['email'].invalid" class="invalid-feedback">
          <small *ngIf="f['email'].errors?.['required']">Email is required.</small>
          <small *ngIf="f['email'].errors?.['email']">Enter a valid email.</small>
          <small *ngIf="f['email'].errors?.['invalidDomain']">Should End With .com only</small>
        </div>
      </div>

      <div class="mb-3">
        <label>Password:</label>
        <input type="password" formControlName="password" class="form-control" [class.is-invalid]="f['password'].touched && f['password'].invalid" />
        <div *ngIf="f['password'].touched && f['password'].invalid" class="invalid-feedback">
          <small *ngIf="f['password'].errors?.['required']">Password is required.</small>
          <small *ngIf="f['password'].errors?.['minlength']">Password must be at least 6 characters.</small>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid">Register</button>
    </form>
  </div>
  `,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule, ReactiveFormsModule],
  selector: "register",
  standalone: true
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitted = false;
  generalError: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email,this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 customEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || typeof value !== 'string') return null;
  return value.endsWith(".com") ? null : { invalidDomain: true };
}
  get f() {
    return this.registerForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    this.generalError = null; 

    if (this.registerForm.invalid) {
      return;
    }

    this.http.post("http://localhost:5050/users/", this.registerForm.value).subscribe({
      next: () => {
        alert('User registered successfully!');
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['/login']);
      },
      error: (e) => {
        if(e.status===400){
          this.generalError="User Already Exists";
        }
        else if (e.status === 500) {
          this.generalError = "Error registering the user. Please try again later."; // 500 server error
        } else {
          console.error(e);
          this.generalError = "An error occurred while processing your request."; // Other errors
        }
      }
    });
  }
}
