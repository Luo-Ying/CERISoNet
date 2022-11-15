/** Service mettant en place la connxion et la gestion de l'envoi et réception des messages avec le serveur */

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  constructor() {
    /** Connexion au serveur pour mise en place webSocket */
    this.socket = io('hhtps://pedago.univ-avignon.fr:3231')
  }

  /** 
   * Méthode d'écoute des événements venant du serveur (utilisation des observables pour 
   * activation dès réception d'un événement!) en s'appuyant sur socket.io-client
   */
  listen(evenement: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(evenement, (data: any) => {
        subscribe.next(data);
      })
    })
  }

  /** Méthode d'envoie au serveur d'un événement et données associées en s'appuyant sur socket.io-client */
  emit(evenement: string, data: any) {
    this.socket.emit(evenement, data);
  }

}
