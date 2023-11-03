import { Injectable } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { AlertController, NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {

  constructor(public navCtrl: NavController,  public alertController: AlertController) { }

  async logOut(){
    NativeBiometric.deleteCredentials({
      server: "fingerPrint",
    }).then();
    this.navCtrl.navigateRoot('login')
  }

  async alertSignup(formulario: FormGroup){
    if(formulario.invalid){
      const alert = await this.alertController.create({
        header:'Datos incompletos',
        message: 'Tienes que rellenar todos los campos',
        buttons: ['Aceptar'],
      });

      await alert.present();
      return false
    }

    if (formulario.value.password != formulario.value.confirmacionPassword){
        const alert = await this.alertController.create({
          header:'Contraseñas distintas',
          message: 'Tienes que poner la misma contraseña',
          buttons: ['Aceptar'],
        });
  
        await alert.present();
        return false
      }
    else{
        var usuario = {
          nombre: formulario.value.nombre,
          password: formulario.value.password
        }
        localStorage.setItem('usuario', JSON.stringify(usuario))
        return true
    }
  }

  async alertLogin(formulario: FormGroup){
    var f = formulario.value;
    var usuarioString = localStorage.getItem('usuario');
    if(usuarioString !== null){
      var usuario= JSON.parse(usuarioString);
      if(usuario.nombre == f.nombre && usuario.password == f.password){
        console.log('Ingresado');
        localStorage.setItem('ingresado','true');
        this.navCtrl.navigateRoot('home');
      }
      else{
        const alert = await this.alertController.create({
          header:'Datos incorrectos',
          message: 'This is an alert!',
          buttons: ['Aceptar'],
        });
        await alert.present();
        return
      }
    }
  }

  async fingerPrint(){
    const result = await NativeBiometric.isAvailable();
      if(!result.isAvailable) return;
      
      const isFINGERPRINT = result.biometryType == BiometryType.FINGERPRINT;

      if (isFINGERPRINT){
        const verified = NativeBiometric.verifyIdentity({
          reason: "For easy log in",
          title: "Log in",
          subtitle: "Comprobar que tus huella es válida",
          description: "Maybe a description too?",
        })
        .then(() => true)
        .catch(() => false);
      
        if (await verified){
          NativeBiometric.getCredentials({ server: "fingerPrint",}).then(credent => {
            if(credent){
              if(credent.username == "Chema" && credent.password == "1234"){
                this.navCtrl.navigateRoot('home')
              }
            }
          });
        }
      }
    }

    biometricActivate(){
      NativeBiometric.isAvailable().then((result)=>{
        if(result.isAvailable){
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
    }).catch(()=> 
    this.alertController.create({
      header:'Error',
      message: 'No tienes la huella de tu dispositivo activada',
      buttons: ['Aceptar'],
    }));
    }
}
