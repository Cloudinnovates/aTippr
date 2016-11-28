//Angular
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//Firebase
import { FirebaseObjectObservable } from 'angularfire2';
//Services
import { MembersService } from '../services/members.service';
import { LoginService } from '../services/login.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private loginservice: LoginService,
    private membersservice: MembersService,
    private router: Router
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    /*return this.loginservice.af.auth.map((auth) =>  {
      if(auth == null) {
        return false;
      } else {
        return this.membersservice.get(auth.uid).map(users => {
          if(users.admin == true) {
            return true;
          } else {
            return false;
          }
        })
      }
    });*/

    /*if( this.loginservice.self.hasOwnProperty('admin') ) {
      return this.loginservice.self['admin'];
    }*/
    return true;
  }

}