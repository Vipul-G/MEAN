import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http
    .get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe((response: {message: string}) => {
      const updatedPosts = this.posts.filter(post => {
        return post.id !== postId;
      });
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts',
      postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,   // differente from video
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });

  }

  updatePost(id: string, title: string, content: string, image: File|string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      console.log('image type was object')
      // handling if image is of file type
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      console.log('image type was string');
      postData = { id, title, content, imagePath: image };
    }

    this.http.put<{ message: string }>(`http://localhost:3000/api/posts/${id}`,
    postData).subscribe((responseData) => {
      /**
       * this.post will remain empty until we do not visit post-list component
       * hence code below is not doing any thing as this.posts is empty
       */
      const post: Post = {
        id,
        title,
        content,
        imagePath: ''
      };
      const updatedPosts = [...this.posts];
      const oldPostIndex: number = updatedPosts.findIndex((p: Post) => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }



}
