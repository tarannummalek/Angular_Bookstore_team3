import { HttpClient, HttpClientModule,HttpHeaders} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-book',
  imports: [ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  file!: File;
  coverImage!: File;

  constructor(private fb : FormBuilder, private http : HttpClient, private router : Router) {
    this.bookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publicationDate: [null, Validators.required],
    isbn: ['', Validators.required],
    genre: [''],
    file: [null, Validators.required],
    fileType: ['', Validators.required],
    description: [''],
    pageCount: [null],
    coverImage: [null],
    publisher: [''],
    keywords: [''],
    price: ['', Validators.required],
    language: ['']
  });
}
  ngOnInit(): void {
    window.addEventListener('storage',(event)=>{
      if(event.key==='token' && event.newValue===null){
        this.router.navigate(['/login'])
      }
    })
  }

  onFileChange(event: any, type: 'file' | 'coverImage') {
    const selectedFile = event.target.files[0];
    if (type === 'file') {
      this.file = selectedFile;
      this.bookForm.patchValue({
        file: this.file,
        fileType: this.file.type
      });
    } else {
      this.coverImage = selectedFile;
      this.bookForm.patchValue({
        coverImage: this.coverImage
      });
    }
  }

  onSubmit() {
  if (this.bookForm.invalid) {
    console.log("form is invalid", this.bookForm);
    return;
  }

  const formData = new FormData();
  const formValue = this.bookForm.value;

  for (const key in formValue) {
    if (key === 'genre' || key === 'keywords') {
      const arr = formValue[key]?.split(',').map((s: string) => s.trim()) || [];
      formData.append(key, JSON.stringify(arr));
    } else if (key === 'price') {
      formData.append(key, formValue[key]);
    } else if (key !== 'file' && key !== 'coverImage') {
      formData.append(key, formValue[key]);
    }
  }
  const headers = new HttpHeaders({
  'Authorization': 'Bearer '+localStorage.getItem("token") // Replace with your actual token
});

  formData.append('pdf', this.file);
  if (this.coverImage) {
    formData.append('coverImage', this.coverImage);
  }

  this.http.post('http://localhost:5050/addBook', formData,{headers}).subscribe({
    next: () =>
      {
        alert('Book added successfully!'),
        this.bookForm.reset();
        this.router.navigate(['/admin']);
      },
    error: (err) => console.error('Error:', err)
  });
}
}
