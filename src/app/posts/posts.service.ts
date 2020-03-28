import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(){
    //return [...this.posts];
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    } ))
    .subscribe((transformedposts) => {
      // this.posts=postData.posts;
      this.posts=transformedposts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){ 
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    //return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string, title: string, content: string }>("http://localhost:3000/api/posts/"+id);
  }

  addPosts(post:Post){
    this.http.post<({message: string, postId: string})>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }

  updatePost(post:Post){
    //console.log(post);
    this.http.put("http://localhost:3000/api/posts/"+post.id, post).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex]=post;
      this.posts=updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }


  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/"+postId).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }


}
