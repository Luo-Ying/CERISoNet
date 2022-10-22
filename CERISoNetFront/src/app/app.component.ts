import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { VarGlobService } from './services/var-glob.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /** declaration des variables propres au composant */
  title = 'CERISoNet';
  // heading: string;
  _auth: AuthentificationService;
  _VarGlob: VarGlobService;

  // _VarGlob
  constructor(
    _auth: AuthentificationService,
    _http: HttpClient,
    _VarGlob: VarGlobService
  ) {  /** Injection du service dans le constructeur du composant */
    this._auth = _auth;
    this._VarGlob = _VarGlob;
    // this.heading = this._VarGlob.headerHeading;
  }

}
