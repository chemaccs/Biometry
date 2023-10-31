import { Component } from '@angular/core';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public alertController: AlertController, public navCtrl: NavController) {}

  biometricActivate(){
    NativeBiometric.isAvailable().then((result)=>
    {if(result.isAvailable){
      var usuarioString = localStorage.getItem('usuario');
      if (usuarioString !== null){
        var usuario= JSON.parse(usuarioString);
      NativeBiometric.setCredentials({
        username: usuario.nombre,
        password: usuario.password,
        server: "fingerPrint",
      }).then();
      }
      
    }
  }).catch(()=> this.alertController.create({
    header:'Error',
    message: 'No tienes la huella de tu dispositivo activada',
    buttons: ['Aceptar'],
  }));
  }

  async logOut(){
    NativeBiometric.deleteCredentials({
      server: "fingerPrint",
    }).then();
    this.navCtrl.navigateRoot('login')
  }
}
