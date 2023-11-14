import { Injectable } from '@angular/core';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { AlertController, NavController} from '@ionic/angular';
import { AuthApiServiceService } from 'src/app/service/auth-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {

  static isBioConfigured() {
    throw new Error('Method not implemented.');
  }

  constructor(public navCtrl: NavController,  public alertController: AlertController, private authApiServiceService:AuthApiServiceService) { }

  /**
   * Biometría y Usuario
   * @description comprueba si está activa la biometría en el dispositivo y además
   *              se sacan los datos del almacén seguro, para comprobar que existen credenciales guardadas.
   * @returns Promise<Boolean>
   */
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
  
  /**
   * LogOut
   * @description Borra de la BD al usuario y lo redirige a la página de login
   * @returns Promise<void>
   */
  async logOut(): Promise<void>{
    await NativeBiometric.deleteCredentials({
      server: "fingerPrint",
    }).then();
    this.navCtrl.navigateRoot('login');
  }

  /**
   * LogIn
   * @description Al loguearse un usuario, se comprueba con la API de Drimay si el usuario es valido.
   *              En el caso de que el usuario sea valido aparecerá un mensaje con 2 botones: "Rechazar" y "Aceptar".
   *              En el caso de "Rechazar" devolvemos un true.
   *              En el caso de "Aceptar" crea un usuario en el almacen seguro y devuelve un true.
   *              En el caso de que el usuario sea invalido devolverá un false
   * @returns Promise<Boolean>
   */
  async login(name: string, password:string): Promise<Boolean>{
    return this.authApiServiceService.login(name, password)
      .then(async (content) => {
        if (content) {
          const alert = await this.alertController.create({
            header: 'Quieres activar la huella',
            message: 'Este mensaje aparecerá siempre que inicies sesión',
            buttons: [
              {
                text: 'Rechazar',
                handler: () => {
                  return true;
                }
              },
              {
                text: 'Aceptar',
                handler: () => {
                  NativeBiometric.setCredentials({
                    username: name,
                    password: password,
                    server: "fingerPrint",
                  }).then(r => {
                    return true;
                  });
                }
              }
            ],
          });
          await alert.present();
          return true;
        } else {
          return false;
        }
      });
  }

  /**
   * Comprovación del dedo
   * @description Primero de todo, se comprueba si está la biometría disponible en el dispositivo,
   *              una vez comprobado si está disponible, saltará la verificación por huella dactilar,
   *              y si la huella es correcta, se sacarán las credenciales del almacén seguro para comprobarlas con
   *              la API de drimay, si los datos son correctos, se redirige a la página home. 
   * @returns Promise<void>
   */
  async fingerPrint(): Promise<void>{
    const result = await NativeBiometric.isAvailable();
      if(!result.isAvailable) return;

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
              this.authApiServiceService.login(credent.username, credent.password).then(answer =>{
                if(answer){
                  this.navCtrl.navigateRoot('home');
                }
              });
            }
          });
        }
    }
  /**
   * Activar la biometría
   * @description Primero de todo, se comprueba si está la biometría disponible en el dispositivo,
   *              una vez comprobado si está disponible, saltará la verificación por huella dactilar,
   *              y si la huella es correcta, se sacarán las credenciales del almacén seguro para comprobarlas con
   *              la API de drimay, si los datos son correctos, se redirige a la página home. 
   * @returns void
   */
    biometricActivate(): void{
      NativeBiometric.isAvailable().then((result)=>{
        if(result.isAvailable){
            NativeBiometric.setCredentials({
              username: this.authApiServiceService.username,
              password: this.authApiServiceService.password,
              server: "fingerPrint",
            }).then();
          }
    }).catch(()=> this.alertNoFingerPrintAvailable);
    }
  /**
   * Alerta de comprovación de la misma contraseña
   * @description Comprueba que las contraseñas son iguales 
   * @returns Promise<boolean>
   */
    async alertPasswordIsEquals(password: any,confirmPassword: any): Promise<boolean>{
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
  /**
   * Alerta de formulario incompleto
   * @description Saltará una alarma, si el formulario tiene algún campo incompleto
   * @returns Promise<boolean>
   */
    async alertControllerFormIncomplete(): Promise<boolean>{
      const alert = await this.alertController.create({
        header:'Datos incompletos',
        message: 'Tienes que rellenar todos los campos',
        buttons: ['Aceptar'],
      });

      await alert.present();
      return false
    }
  /**
   * Alerta de login incorrecto
   * @description Saltará una alarma, si los datos son incorrectos
   * @returns Promise<void>
   */
    async alertLoginIncorrect(): Promise<void>{
      const alert = await this.alertController.create({
        header:'Datos incorrectos',
        message: 'This is an alert!',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return
    }
  /**
   * Alerta huella invalida
   * @description Saltará una alarma, si la biometría no está activada en el dispositivo
   * @returns Promise<void>
   */
    private async alertNoFingerPrintAvailable(): Promise<void>{
      const alert= await this.alertController.create({
        header:'Error',
        message: 'No tienes la huella de tu dispositivo activada',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return
    }
}
