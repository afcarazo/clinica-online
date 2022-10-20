import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toastr: ToastrService) { }
  showNotificationError(header:string,message:any) {
    this.toastr.error(message,header,{
      timeOut: 2200,
      positionClass: 'toast-top-center'
    });
  }
  showNotificationSuccess(header:string,message:any) {
    this.toastr.success(message,header,{
      timeOut: 2200,
      positionClass: 'toast-top-center'
    });
  }
}
