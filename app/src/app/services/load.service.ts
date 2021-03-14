import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  constructor(public loadingController: LoadingController) {}

  async presentLoading(duration: number = 2000, message: string = 'Please wait ...') {
    const loading = await this.loadingController.create({
      message: message,
      duration: duration
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  public dismissLoading() {
    this.loadingController.dismiss();
  }
}
