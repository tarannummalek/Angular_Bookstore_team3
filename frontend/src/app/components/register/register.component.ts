import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({

  template:`
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

  <label>First Name:</label>
  <input formControlName="firstName" />
  <div *ngIf="submitted && f['firstName']['errors']">
    <small *ngIf="f['firstName'].errors['required']">First name is required.</small>
  </div>

  <label>Last Name:</label>
  <input formControlName="lastName" />
  <div *ngIf="submitted && f['lastName']['errors']">
    <small *ngIf="f['lastName'].errors">Last name is required.</small>
  </div>

  <label>Mobile:</label>
  <input formControlName="mobile" />
  <div *ngIf="submitted && f['mobile'].errors">
    <small *ngIf="f['mobile'].errors">Mobile number is required.</small>
    <small *ngIf="f['mobile'].errors['pattern']">Enter a valid 10-digit mobile number.</small>
  </div>

  <label>Email:</label>
  <input formControlName="email" />
  <div *ngIf="submitted && f['email'].errors">
    <small *ngIf="f['email'].errors['required']">Email is required.</small>
    <small *ngIf="f['email'].errors['email']">Enter a valid email.</small>
  </div>

  <label>Password:</label>
  <input type="password" formControlName="password" />
  <div *ngIf="submitted && f['password'].errors">
    <small *ngIf="f['password'].errors['required']">Password is required.</small>
    <small *ngIf="f['password'].errors['minLength']">
      Password must be at least 6 characters.
    </small>
  </div>

  <button type="submit">Register</button>
</form>
  `,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule,ReactiveFormsModule],
  selector:"register",
  standalone:true


})export class RegisterComponent{

  registerForm:FormGroup
  submitted=false;
  constructor(private fb: FormBuilder,private http:HttpClient,private router:Router){
    this.registerForm=this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

  }

  get f() {
    return this.registerForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.http.post("http://localhost:5050/users/",this.registerForm.value).subscribe({
      next:()=>{
        this.registerForm.reset();
        this.router.navigate(['/admin']);
      },
      error:()=>{
        console.log("Error While Submitting The Form");
      }
    });
    // Registration logic here
    console.log('Registered User:', this.registerForm.value);
    alert('User registered successfully!');

    // Optionally reset the form
    this.registerForm.reset();
    this.submitted = false;
  }

}
