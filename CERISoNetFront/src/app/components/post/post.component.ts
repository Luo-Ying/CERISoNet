import { Component, OnInit, Input } from '@angular/core';

import { comment, image, post } from 'src/app/util/type';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: post | undefined;

  constructor() { }

  ngOnInit(): void {

    if (this.post) {
      console.log(this.post);
      console.log(this.post.images.url);

    }

  }

}
