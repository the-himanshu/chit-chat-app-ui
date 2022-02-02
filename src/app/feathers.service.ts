import { Injectable, EventEmitter } from '@angular/core';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/socketio-client';
import feathersAuthClient from '@feathersjs/authentication-client';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const INITIAL_DELAY = 5;

/**
 * Simple wrapper for feathers
 */
@Injectable()
export class FeathersService {
  private reconnectDelay: any = 5; // in seconds
  private onAppConnected = new EventEmitter();
  private feathers = feathers(); // init socket.io
  public reconnectSocketFlag = 0;
  public tempAccessToken = null;
  public userEmail = null;
  public visibilityChange: string = '';
  public isHidden: string = '';
  public credentialsCache: any;
  public onlineEventEmitter$ = new Subject<boolean>();
  public latestVersion$ = new Subject<string>();
  private socket = io(environment.backendUrl, {
    transports: ['websocket'], 
    forceNew: true,
    upgrade: false,
}); // init feathers
  private isOnlineVar = true;

  constructor(private router: Router) {
    this.feathers
      .configure(
        feathersSocketIOClient(this.socket, {
          timeout: 10000,
        })
      ) // add socket.io plugin
      .configure(
        feathersAuthClient({
          storage: window.localStorage,
        })
      );

    this.socket.on('connect', () => {
      console.log(
        'Socket connection established at',
        new Date(),
        'with id',
        this.feathers.io.id
      );
      this.isOnlineVar = true;
      this.reconnectDelay = null;
      this.onAppConnected.emit();
    });

    this.socket.on('disconnect', (data) => {
      console.log('Socket disconnected at', new Date());
      this.isOnlineVar = false;
    });

    this.socket.on('reconnect', (numberOfAttempts) => {
      console.log(
        `Socket auto reconnected after ${numberOfAttempts} attempts at time ${new Date()}`
      );
      this.authentication()
        .then((res) => {
          this.onlineEventEmitter$.next(true);
          console.log(
            `Successful reconnection and authentication at ${new Date()}`,
            res
          );
        })
        .catch((err) => {
          console.log(
            `Failed reconnection and authentication at ${new Date()}`,
            err
          );
        });
    });

    this.socket.on('reconnect_attempt', (numberOfAttempts) => {
      console.log(
        'Socket attempting reconnection at',
        new Date(),
        'for',
        numberOfAttempts,
        'times'
      );
      this.isOnlineVar = false;
      if (navigator.onLine) {
        const delay = this.getTimings();
        this.socket.io.reconnectionDelay(delay);
        this.socket.io.reconnectionDelayMax(delay);
        console.log(
          `Socket Failed to connect at ${numberOfAttempts} attempt, will retry again in ${
            this.socket.io
          } seconds, current time ${new Date()}`
        );
      } else {
        this.socket.io.reconnectionAttempts(0);
      }
    });

    window.addEventListener('offline', (e) => {
      console.log(`user lost internet connection at ${new Date()}`);
      this.onlineEventEmitter$.next(false);
    });
    window.addEventListener('online', (e) => {
      console.log(`user connected to internet at ${new Date()}`);
      this.authentication();
      this.reconnectSocket();
      this.onlineEventEmitter$.next(true);
    });
    if (typeof document.hidden !== 'undefined') {
      this.isHidden = 'hidden';
      this.visibilityChange = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      this.isHidden = 'msHidden';
      this.visibilityChange = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      this.isHidden = 'webkitHidden';
      this.visibilityChange = 'webkitvisibilitychange';
    }

    if (this.visibilityChange) {
      document.addEventListener(
        this.visibilityChange,
        (event) => {
          console.log('visiblity changed', document.visibilityState);
          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            if (document.visibilityState == 'visible') {
              console.log('reconnecting visible');
              this.reconnectSocket();
            } else {
              console.log('disconnecting unvisible');
              this.socket.disconnect();
            }
          }
          this.handleVisibilityChange();
        },
        false
      );
    }
  }
  public handleVisibilityChange() {
    if (
      !document[this.isHidden] &&
      this.socket?.disconnected &&
      navigator.onLine
    ) {
      this.onlineEventEmitter$.next(true);
      this.authentication();
      this.reconnectSocket();
    }
  }

  public reconnectSocket() {
    console.log('[USER] Initiated reconnect attempt');
    this.reconnectDelay = null;
    this.reconnectBridge();
  }

  public getOnAppConnectedEvent() {
    return this.onAppConnected;
  }

  public getisOnline(): boolean {
    if (!navigator.onLine) {
      this.reconnectSocketFlag = 0;
    } else {
      if (this.reconnectSocketFlag === 0) {
        this.reconnectSocket();
        this.reconnectSocketFlag++;
      }
    }
    return navigator.onLine;
  }

  // expose services
  public service(name: string) {
    return this.feathers.service(name);
  }

  public applicationUpdated(timeStamp: any) {
    if (timeStamp) {
      this.latestVersion$.next(timeStamp);
    }
  }

  // expose authentication
  public authentication(credentials?: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.feathers.authenticate(credentials)
        .then((res: any) => {
          if (res?.webDeploymentTimeStamp) {
            this.latestVersion$.next(res.webDeploymentTimeStamp);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // expose logout
  public logout() {
    return this.feathers.logout();
  }

  // Remove listeners
  public removeListeners() {
    const services = this.feathers.services;

    for (const serviceName in services) {
      if (services.hasOwnProperty(serviceName)) {
        this.service(serviceName).removeAllListeners('created');
        this.service(serviceName).removeAllListeners('updated');
        this.service(serviceName).removeAllListeners('patched');
        this.service(serviceName).removeAllListeners('removed');
        this.service(serviceName).removeAllListeners('getMany');
        this.service(serviceName).removeAllListeners('multiCreated');
      }
    }
  }

  private reconnectBridge() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  public isSocketConnected(): boolean {
    return this.socket.connected;
  }

  private getTimings() {
    if (!this.reconnectDelay) {
      this.reconnectDelay = INITIAL_DELAY;
    } else {
      this.reconnectDelay = this.reconnectDelay * 2;
    }

    // convert into ms for script
    return this.reconnectDelay * 1000;
  }
}
