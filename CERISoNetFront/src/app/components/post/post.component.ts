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
    private router: Router,
    private _webSocket: WebSocketService
  ) { }

  ngOnInit(): void {

    this.id_user = Number(localStorage.getItem('id'));

    this._webSocket.listen('updateLike').subscribe((data) => {
      console.log(data);
    })

    if (this.post) {
      this.nbLike = this.post.likes;
      if (this.post.likedby) {
        console.log("id user: ", this.id_user);
        console.log(this.post.likedby.indexOf(this.id_user));


        if (this.post.likedby.indexOf(this.id_user) == -1) {
          this.isLiked = false;
        } else {
          this.isLiked = true;
        }
        console.log(this.isLiked);

      }

      this._database.GetInfosUserById(this.post.createdBy).subscribe(
        data => {
          this.author = data;
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
    this.nbLike++;
    this.isLiked = !this.isLiked;
    /** */
    this._webSocket.emit('updateLike',
      {
        id_post: this.post._id,
        id_user: this.id_user,
        nbLike: this.nbLike,
        isLiked: this.isLiked
      });
  }

  dislike(): void {
    this.nbLike--;
    this.isLiked = !this.isLiked;
    /** */
    this._webSocket.emit('updateLike',
      {
        id_post: this.post._id,
        id_user: this.id_user,
        nbLike: this.nbLike,
        isLiked: this.isLiked
      });
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
      this._database.AddComment(this.post._id, objComment).subscribe(
        data => {
          // this.author = data;
          console.log("add comment!");
          location.reload();

        },
        error => {
          console.log(error);

        }
      )
    }
    else {
      this.isSubmitedCommentEmpty = true;
    }
    // location.reload();
  }

}
