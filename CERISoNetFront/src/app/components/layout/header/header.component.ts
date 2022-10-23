import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;

  constructor(private _auth: AuthentificationService) {
    // this.isLogged = this._VarGlob.isLogged;
    // console.log("coucou", localStorage);
    this.isLogged = localStorage['id'] ? true : false;
  }

  ngOnInit(): void {
  }

  disconnect = () => {
    console.log("coucou");
    // this._auth.Disconnect().subscribe(
    //   data => {
    //     console.log(data);

    //   },
    //   error => {
    //     console.log(error);

    //   }
    // );
    this._auth.Disconnect();
  }

}
