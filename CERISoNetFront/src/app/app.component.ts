import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /** declaration des variables propres au composant */
  title = 'CERISoNetFront';
  _auth: AuthentificationService;

  // _VarGlob
  constructor(_auth: AuthentificationService, _http: HttpClient) {  /** Injection du service dans le constructeur du composant */
    this._auth = _auth
  }

}
