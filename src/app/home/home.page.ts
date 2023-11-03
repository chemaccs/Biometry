import { Component } from '@angular/core';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { AlertController, NavController} from '@ionic/angular';
import { BiometricService } from '../biometric.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public alertController: AlertController, public navCtrl: NavController,
     private biometricService: BiometricService) {}

  biometricActivate(){
    this.biometricService.biometricActivate();
  }
  async logOut(){
    this.biometricService.logOut();
  }
}
