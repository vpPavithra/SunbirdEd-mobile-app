import { Injectable } from '@angular/core';
// import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Network } from '@capacitor/network';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  connectSubscription;
  disconnectSubscription;
  syncSettingData: any;
  $networkStatus = new Subject();
  isNetworkAvailable: boolean = false;
  constructor(
    // private toast: ToastMessageService,
    private translate: TranslateService,
    // private storage: LocalStorageService,
  ) { }

  async netWorkCheck() {
    this.getCurrentStatus();
    let networkType = (await Network.getStatus()).connectionType;
    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   this.isNetworkAvailable = false;
    //   this.$networkStatus.next(this.isNetworkAvailable);
    //   // this.translate.get('MESSAGES.YOU_ARE_WORKING_OFFLINE').subscribe(data => {
    //   //   !this.isNetworkAvailable ? this.toast.showMessage(data, 'danger', 'construct-outline') : ''
    //   // })
    // });
    // this.connectSubscription = this.network.onConnect().subscribe(() => {
    //   this.isNetworkAvailable = true;
    //   this.$networkStatus.next(this.isNetworkAvailable);
    // });
  }

  async getCurrentStatus() {
    let networkType = (await Network.getStatus()).connectionType;
    if (networkType == 'none') {
      this.isNetworkAvailable = false;
      this.$networkStatus.next(this.isNetworkAvailable);
    } else {
      this.isNetworkAvailable = true;
      this.$networkStatus.next(this.isNetworkAvailable);
    }
  }
  // public stopNetworkService() {
  //   this.connectSubscription.unsubscribe();
  //   this.disconnectSubscription.unsubscribe();
  // }

  // method to handle on sync setting change
  checkSyncSettings(): Promise<any> {
    return new Promise((resolve, reject) => {   
    });
  }

}
