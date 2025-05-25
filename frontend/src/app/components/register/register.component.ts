import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
@Component({
  templateUrl:'./register.component.html',
  styleUrl:'./register.componenet.css',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule, ReactiveFormsModule],
  selector: "register",
  standalone: true
})
export class RegisterComponent {
  showPassword:boolean=false
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
    this.generalError = null; // Reset any previous error messages

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
