import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private auth:AuthService, private notification:NotificationsService, private router:Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.estaActivo();
  }
  
  estaActivo():boolean { 
    if (this.auth.sesionActiva) {
      return true;
    }
    else {
      this.notification.showNotificationError('ERROR', 'Debe iniciar sesión para acceder a esta página!');
      this.router.navigate([''])
      return false;
    }

  }
}
