import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type-validator';

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
  form: FormGroup;
  imagePreview: string;
  //@Output() postCreated= new EventEmitter<Post>();

  constructor(private postsService:PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null,{validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode ='edit';
        this.postId = paramMap.get('postId');
        this.isLoading=true;
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading=false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath};

          this.form.setValue({'title': this.post.title,'content': this.post.content, 'image': this.post.imagePath});
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onImagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    //console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      const post: Post = {title: this.form.value.title, content: this.form.value.content, image: this.form.value.image};
      //this.postCreated.emit(post);
      this.postsService.addPosts(post);
      this.form.reset();
    }
    if(this.mode === 'edit'){
      const post: Post = {id: this.postId,title: this.form.value.title, content: this.form.value.content, image: this.form.value.image};
      this.postsService.updatePost(post);
      this.form.reset();
    }
    
  }

}
