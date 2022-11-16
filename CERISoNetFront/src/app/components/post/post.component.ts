import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { VarGlobService } from 'src/app/services/var-glob.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';

import { comment, post, author } from 'src/app/util/type';
import { dateFormat, hourFormat } from 'src/app/util/algorithm';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  id_user!: number;

  @Input()
  post!: post;

  author!: author;

  nbLike!: number;

  isLiked!: boolean;

  commentsArray: Array<post> = [];

  hashtags: Array<string> = ["all"];

  avatarEmpty = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
  imageNotFound = "https://aeroclub-issoire.fr/wp-content/uploads/2020/05/image-not-found.jpg";

  comments: Array<comment> = [];

  formData!: FormGroup;

  isSubmitedCommentEmpty: boolean = false;

  constructor(
    private _database: DatabaseService,
    private _VarGlob: VarGlobService,
    private _webSocket: WebSocketService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this._webSocket.listen('commentUpdate').subscribe((data) => {
      // this.comments = data
      location.reload();
    })

    this.id_user = Number(localStorage.getItem('id'));
    if (this.post) {
      this.nbLike = this.post.likes;
      if (this.post.likedby) {
        if (this.post.likedby.indexOf(this.id_user) == -1) {
          this.isLiked = false;
        } else {
          this.isLiked = true;
        }
      }

      this._database.GetInfosUserById(this.post.createdBy).subscribe(
        data => {
          this.author = data;
          // console.log(data);

        },
        error => {
          console.log(error);

        }
      );

      if (this.post.comments.length > 0) {
        // console.log(this.post.comments);

        this.post.comments.forEach(element => {
          // console.log(element);

          this.comments.push(element);
        });
      }
    }

    this.formData = new FormGroup({
      comment: new FormControl(),
    });

  }

  like(): void {
    // console.log("coucou");
    this.nbLike++;
    this.isLiked = !this.isLiked;
    this._database.LikePost(this.post._id, this.id_user, this.nbLike, this.isLiked).subscribe(
      data => {
        // this.author = data;
        // console.log(data);

      },
      error => {
        console.log(error);

      }
    );
  }

  dislike(): void {
    this.nbLike--;
    this.isLiked = !this.isLiked;
    this._database.LikePost(this.post._id, this.id_user, this.nbLike, this.isLiked).subscribe(
      data => {
        // this.author = data;
        // console.log(data);

      },
      error => {
        console.log(error);

      }
    );
  }

  onSubmit() {
    console.log("submit!");
    console.log(this.formData.value.comment);
    let date = dateFormat(new Date());
    let hour = hourFormat(new Date());
    if (this.formData.value.comment != null) {
      this.isSubmitedCommentEmpty = false;
      let objComment: comment = {
        text: this.formData.value.comment,
        commentedBy: this.id_user,
        date: date,
        hour: hour,
      };
      // this._database.AddComment(this.post._id, objComment).subscribe(
      //   data => {
      //     // this.author = data;
      //     console.log("add comment!");
      //     location.reload();

      //   },
      //   error => {
      //     console.log(error);

      //   }
      // )
      this._database.AddComment(this.post._id, objComment);
    }
    else {
      this.isSubmitedCommentEmpty = true;
    }
    // location.reload();
  }

}
