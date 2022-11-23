import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VarGlobService } from 'src/app/services/var-glob.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

import { user } from 'src/app/util/type';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Array<user> = [];

  usersOnline: Array<user> = [];
  usersOutline: Array<user> = [];

  // page: number = 1;
  // pageSize: number = 10;

  page = 1;
  pageSize = 10;
  collectionSize = this.users.length;

  constructor(
    private router: Router,
    private _VarGlob: VarGlobService,
    private _webSocket: WebSocketService,
  ) {
  }


  ngOnInit(): void {

    this._webSocket.listen('getAllUsers').subscribe((data) => {
      this.users = [];
      this.usersOnline = [];
      this.usersOutline = [];
      console.log("coucou??????????");
      // if (data.status == 200) {
      this.users = data.users;
      data.users.forEach((e: user) => {
        if (e.status_connexion == 1) {
          console.log(e.identifiant);

          this.usersOnline.push(e);
        }
        else {
          this.usersOutline.push(e);
        }
      });
      // }
    })

    if (localStorage.getItem('id')) {
      this._webSocket.emit('getAllUsers', {});
    }
    else {
      this._VarGlob.bandeauMessage = "Connectez-vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }

}
