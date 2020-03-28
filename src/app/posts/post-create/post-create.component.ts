import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle='';
  enteredContent='';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  //@Output() postCreated= new EventEmitter<Post>();

  constructor(private postsService:PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode ='edit';
        this.postId = paramMap.get('postId');
        this.isLoading=true;
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading=false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      const post: Post = {title: form.value.title, content: form.value.content};
      //this.postCreated.emit(post);
      this.postsService.addPosts(post);
      form.resetForm();
    }
    if(this.mode === 'edit'){
      const post: Post = {id: this.postId,title: form.value.title, content: form.value.content};
      this.postsService.updatePost(post);
      form.resetForm();
    }
    
  }

}
