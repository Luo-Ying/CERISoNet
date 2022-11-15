import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { VarGlobService } from './services/var-glob.service';

/** Utilisation du service dans le composant */
/** Le service a été inclus comme il se doit dans le module associé */
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /** declaration des variables propres au composant */
  webSocket: WebSocketService = new WebSocketService;

  title = 'CERISoNet';
  // heading: string;
  _auth: AuthentificationService;
  _VarGlob: VarGlobService;

  // _VarGlob
  constructor(
    _auth: AuthentificationService,
    _http: HttpClient,
    _VarGlob: VarGlobService,
    private _webSocket: WebSocketService
  ) {  /** Injection du service dans le constructeur du composant */
    this._auth = _auth;
    this._VarGlob = _VarGlob;
    /** Appel du service WebSocketService */
    this.webSocket = _webSocket;
    /** Envoie d'un événement au serveur */
    this.webSocket.emit('login', 'Bonjour Serveur!');
  }

  ngOnInit(): void {
    /** 
     * le client écoute le serveur sur l'événement 'reponse' par le biais du service webSocket (méthode listen)
     * et récupère les données associées data
     */
    this.webSocket.listen('reponse').subscribe((data) => {
      this._VarGlob.bandeauMessage = data;
    });

    /** 
     * le client envoie l'événement 'login' au serveur par le bias du service sebSocket (méthode emit) 
     * et les données associées 'message du client'
    */
    this.webSocket.listen('login').subscribe((data) => {
      alert(data);
    })

    /**
     * le client envoie l'événement 'notification' au serveur par le bias du serveur webSocket (méthode emit)
     * et les données associées 'message du client'
     */
    this.webSocket.emit('messageClient', 'message du client');
    console.log('messageClient');

  }

  /** N'import où dans le traitement du composant, on peut trouver */
  // this.webSocket.emit('notification', 'envoie d\'une notification');

}
