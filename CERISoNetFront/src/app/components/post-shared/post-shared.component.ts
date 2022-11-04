import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { post, author } from 'src/app/util/type';

@Component({
  selector: 'app-post-shared',
  templateUrl: './post-shared.component.html',
  styleUrls: ['./post-shared.component.css']
})
export class PostSharedComponent implements OnInit {

  @Input()
  idPost!: number;

  post!: post;

  author: author | undefined;

  constructor(private _database: DatabaseService) { }

  ngOnInit(): void {
    this._database.GetPostById(this.idPost).subscribe(
      data => {
        this.post = data;

        if (this.post) {
          this._database.GetInfosUserById(this.post.createdBy).subscribe(
            data => {
              this.author = data;
            },
            error => {
              console.log(error);
            }
          )

        }
      },
      error => {
        console.log(error);

      }
    )

  }

}
