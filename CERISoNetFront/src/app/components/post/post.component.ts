import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

import { comment, image, post } from 'src/app/util/type';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: post | undefined;

  constructor(private _database: DatabaseService) { }

  ngOnInit(): void {

    if (this.post) {
      console.log(this.post);
      console.log(this.post.images.url);

      this._database.GetInfosUserById(this.post.createdBy).subscribe(
        data => {
          console.log(data);

        },
        error => {
          console.log(error);

        }
      )

    }

  }

}
