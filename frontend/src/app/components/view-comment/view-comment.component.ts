import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-comment',
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './view-comment.component.html',
  styleUrl: './view-comment.component.css'
})
export class ViewCommentComponent {
comments:any=[];
bookId:any;

  constructor(private route:ActivatedRoute,private http:HttpClient,private router:Router){
  }

  ngOnInit(){
    this.bookId= this.route.snapshot.paramMap.get('bookId');
    this.getComments();
  }

  getComments(){
    this.http.get('http://localhost:5050/books/'+this.bookId+'/comments').subscribe((data:any)=>{
      this.comments=data;
      console.log(this.comments);
    });
  }

  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.http.delete(`http://localhost:5050/comments/${commentId}`)
        .subscribe(() => this.getComments());
    }
  }

}
