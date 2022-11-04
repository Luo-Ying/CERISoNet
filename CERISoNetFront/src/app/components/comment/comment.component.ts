import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { comment, author } from 'src/app/util/type';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: comment | undefined;

  author: author | undefined;

  constructor(private _database: DatabaseService) { }

  ngOnInit(): void {
    if (this.comment) {

      this._database.GetInfosUserById(this.comment.commentedBy).subscribe(
        data => {
          this.author = data;
        },
        error => {
          console.log(error);

        }
      )

    }
  }

}
