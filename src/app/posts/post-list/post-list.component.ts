import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage=1;
  pageSizeOptions = [1, 2, 5, 10];
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(private postsService:PostsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub=this.postsService.getPostUpdateListener().subscribe((postData:{posts: Post[], postCount: number}) => {
      this.isLoading=false;
      this.totalPosts=postData.postCount;
      this.posts=postData.posts;
      //console.log(this.posts);
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })

    //console.log(this.userId);
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage=pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    }, ()=> {
      this.isLoading = false;
    });
  }


  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }



}
