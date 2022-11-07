import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;

  message: string = '';
  msgType: string = '';

  constructor(
    private _auth: AuthentificationService,
    private router: Router,
    private _VarGlob: VarGlobService
  ) {
    this.isLogged = localStorage['id'] ? true : false;
  }

  ngOnInit(): void {
  }

  disconnect = () => {
    this._auth.Disconnect().subscribe(
      data => {
        this.message = "Utilisateur déconnecte!";
        this.msgType = 'warning';
        this._VarGlob.userLastLogin = "";
        this._VarGlob.bandeauMessage = "Utilisateur déconnecte!";
        this._VarGlob.bandeauMsgType = 'warning';
        this.isLogged = false;
        this._VarGlob.isLogged = false;
        this.router.navigate(['/login'], {});
      },
      error => {

      }
    );
  }

}
