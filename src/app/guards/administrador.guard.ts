import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorGuard implements CanActivate {
  constructor(private auth:AuthService, private notificacion:NotificationsService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.esAdmin();
  }
  esAdmin(): boolean {
    
    if (this.auth.usuarioActual != undefined) {
      if (this.auth.usuarioActual.perfil === 'administrador') {
        return true;
      }
    }
    else { 
      console.log(this.auth.usuarioActual);
    }
    return false;
  }
}
