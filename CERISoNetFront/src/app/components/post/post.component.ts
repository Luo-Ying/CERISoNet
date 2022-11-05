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

  constructor(
    private _database: DatabaseService,
    private _VarGlob: VarGlobService,) { }

  ngOnInit(): void {
    this.id_user = Number(localStorage.getItem('id'));
    if (this.post) {
      this.nbLike = this.post.likes;
      if (this.post.likedby.indexOf(this.id_user) == -1) {
        this.isLiked = false;
      } else {
        this.isLiked = true;
      }

      this._database.GetInfosUserById(this.post.createdBy).subscribe(
        data => {
          this.author = data;
          console.log(data);

        },
        error => {
          console.log(error);

        }
      );
    }

  }

  like(): void {
    console.log("coucou");
    this.nbLike++;
    this.isLiked = !this.isLiked;
    this._database.LikePost(this.post._id, this.id_user, this.nbLike, this.isLiked).subscribe(
      data => {
        // this.author = data;
        console.log(data);

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
        console.log(data);

      },
      error => {
        console.log(error);

      }
    );
  }

}
