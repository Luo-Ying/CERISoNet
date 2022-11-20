import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { VarGlobService } from 'src/app/services/var-glob.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  maxId!: number;

  constructor(
    private _database: DatabaseService,
    private _VarGlob: VarGlobService,
    private router: Router,
    private _webSocket: WebSocketService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.id_user = Number(localStorage.getItem('id'));

    this._webSocket.listen('updateLike').subscribe((data) => {
      console.log(data);
      this.nbLike = data.likes;
    })

    this._webSocket.listen('updateComments').subscribe((data) => {
      console.log("listning...");

      console.log(data);
      this.comments = data.comments;
    })

    this._webSocket.listen('sendMaxId').subscribe((data) => {
      this.maxId = data[0]._id;
    })

    this._webSocket.listen('messageClient').subscribe((data) => {
      alert(data);
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
        this.post.comments.forEach(element => {
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

  openSharePostModal(longContent: any): void {
    this.modalService.open(longContent, {
      windowClass: 'modal-class',
      scrollable: true,
      backdrop: false,
      size: 'lg',
      centered: true,
      animation: true
    });
    this._webSocket.emit('getMaxPostId', {});
  }

  confirmSharePost(): void {
    console.log(this.maxId);

    this.post.Shared
      ? console.log(this.post.Shared)
      : console.log(this.post._id);
    let objPost = {
      _id: this.maxId + 1,
      date: dateFormat(new Date()),
      hour: hourFormat(new Date()),
      createdBy: this.id_user,
      Shared: this.post.Shared ? this.post.Shared : this.post._id,
      likes: 0,
      comments: []
    };
    // console.log(new Date());
    // console.log(dateFormat(new Date()));

    console.log(objPost);

    this._webSocket.emit('sharePost',
      {
        objPost: objPost
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

      this._webSocket.emit('addComment',
        {
          id_post: this.post._id,
          comment: objComment
        });
    }
    else {
      this.isSubmitedCommentEmpty = true;
    }
  }

}
