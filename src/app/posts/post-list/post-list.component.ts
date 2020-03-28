import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the post'},
  //   {title: 'First Post', content: 'This is the post'},
  //   {title: 'First Post', content: 'This is the post'},
  //   {title: 'First Post', content: 'This is the post'}
  // ];

  //@Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub : Subscription;
  isLoading=false;

  constructor(private postsService:PostsService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.postsService.getPosts();
    this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[]) => {
      this.isLoading=false;
      this.posts=posts;
    });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }



}
