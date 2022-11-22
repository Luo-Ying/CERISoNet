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

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private router: Router,
    private _VarGlob: VarGlobService,
    private _webSocket: WebSocketService,
  ) { }

  ngOnInit(): void {

    this._webSocket.listen('getAllUsers').subscribe((data) => {
      if (data.status == 200) {
        // console.log(data);
        this.users = data.users;
      }
    })

    // console.log(this.users);



    if (localStorage.getItem('id')) {
      this._webSocket.emit('getAllUsers',
        {});
    }
    else {
      this._VarGlob.bandeauMessage = "Connectez-vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }

}
