import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {AuthService} from "../service/auth.service"
@Component({
  templateUrl:'./login.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, HttpClientModule],
  styleUrls:['./login.component.css'],
  selector: "login",
  providers:[],
  standalone: true
})
export class LoginForm {
  showPassword: boolean = false;
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
  if (!value) return null;
  const isValid = value.endsWith('.com');
  return isValid ? null : { notComDomain: true };
}
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.generalError = null;
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
          this.router.navigate(["/user-dashboard"])
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
          this.generalError = "Error occurred while logging in. Please try again.";
        }
        console.log("Error While Submitting The Form");
      },
    });
  }
}
