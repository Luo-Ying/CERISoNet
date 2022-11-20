import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { comment, author } from 'src/app/util/type';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  comment!: comment;

  @Input()
  idPost!: number;

  author!: author;

  idUser: number;

  avatarEmpty = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

  constructor(
    private _database: DatabaseService,
    private _webSocket: WebSocketService,
  ) {
    this.idUser = Number(localStorage.getItem("id"));
  }

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

  deleteComment(): void {
    if (this.comment) {
      console.log(typeof this.comment.text);
      console.log(this.idPost);
      this._webSocket.emit('deleteComment',
        {
          id_post: this.idPost,
          commentText: this.comment.text
        });
    }
  }

}
