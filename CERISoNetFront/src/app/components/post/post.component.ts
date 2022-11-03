import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { VarGlobService } from 'src/app/services/var-glob.service';

import { comment, image, post, author } from 'src/app/util/type';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: post | undefined;

  author: author | undefined;

  commentsArray: Array<post> = [];

  hashtags: Array<string> = ["all"];

  imageNotFound = "https://aeroclub-issoire.fr/wp-content/uploads/2020/05/image-not-found.jpg";

  constructor(
    private _database: DatabaseService,
    private _VarGlob: VarGlobService,) { }

  ngOnInit(): void {

    if (this.post) {
      console.log(this.post);
      console.log(this.post.images?.url);

      this._database.GetInfosUserById(this.post.createdBy).subscribe(
        data => {
          // console.log(data);
          this.author = data;
          console.log(this.author);
        },
        error => {
          console.log(error);

        }
      )

    }

    // console.log(this.author);

  }

}
