import { Injectable } from '@angular/core';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { AlertController, NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {
  static isBioConfigured() {
    throw new Error('Method not implemented.');
  }

  constructor(public navCtrl: NavController,  public alertController: AlertController) { }

  async isBioConfigured(): Promise<Boolean>{
    if(await NativeBiometric.isAvailable()){
      let credential= NativeBiometric.getCredentials({ server: "fingerPrint",});
      if(await credential){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  
  async logOut(){
    await NativeBiometric.deleteCredentials({
      server: "fingerPrint",
    }).then();
    this.navCtrl.navigateRoot('login');
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
              this.loginUpAPI(credent.username, credent.password).then(answer =>{
                if(answer){
                  this.navCtrl.navigateRoot('home');
                }
              });
            }
          });
        }
      }
    }

    biometricActivate(){
      NativeBiometric.isAvailable().then((result)=>{
        if(result.isAvailable){
          let usuarioString = localStorage.getItem('usuario');
        if (usuarioString !== null){
          let usuario= JSON.parse(usuarioString);
          NativeBiometric.setCredentials({
            username: usuario.nombre,
            password: usuario.password,
            server: "fingerPrint",
          }).then();
        }
      }
    }).catch(()=> this.alertNoFingerPrintAvailable
    );
    }

    async alertPasswordIsEquals(password: any,confirmPassword: any){
      if (password != confirmPassword){
        const alert = await this.alertController.create({
          header:'Contraseñas distintas',
          message: 'Tienes que poner la misma contraseña',
          buttons: ['Aceptar'],
        });
  
        await alert.present();
        return false
      }
      else{
        return true
      }
    }

    async alertControllerFormIncomplete(){
      const alert = await this.alertController.create({
        header:'Datos incompletos',
        message: 'Tienes que rellenar todos los campos',
        buttons: ['Aceptar'],
      });

      await alert.present();
      return false
    }

    async alertLoginIncorrect(){
      const alert = await this.alertController.create({
        header:'Datos incorrectos',
        message: 'This is an alert!',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return
    }

    async alertNoFingerPrintAvailable(){
      const alert= await this.alertController.create({
        header:'Error',
        message: 'No tienes la huella de tu dispositivo activada',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return
    }

    async loginUpAPI(name: any, password: any){
      var usuarioString = localStorage.getItem('usuario');
      if (usuarioString !=null){
        var usuario= JSON.parse(usuarioString);
        if(name == usuario.nombre && password == usuario.password){
          
          localStorage.setItem('ingresado','true');
          return true;
        }
        else{
          console.log(''+password);
          console.log(''+usuario.password);
          console.log(''+name);
          console.log(''+usuario.name);
          
          return false
        }
      }
      return true
    }

    async createUserAPI(name: any, password: any){
      let usuario = {
        nombre: name,
        password: password
      }
      localStorage.setItem('usuario', JSON.stringify(usuario))
      return true
    }
}
