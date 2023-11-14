import { Component } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { BiometricService } from 'src/app/service/biometric.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public alertController: AlertController, public navCtrl: NavController,
     private biometricService: BiometricService) {}

  biometricActivate(): void{
    this.biometricService.biometricActivate();
  }
  async logOut(): Promise<void>{
    this.biometricService.logOut();
  }
}
