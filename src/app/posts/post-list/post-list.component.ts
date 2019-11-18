import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPost = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  private postSub: Subscription;

  constructor(public postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener().subscribe(
        (posts: Post[]) => {
          this.isLoading = false;
          this.posts = posts;
        }
      );
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
