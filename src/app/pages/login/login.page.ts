import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  isDisable: Boolean = false;
  
  constructor(public fb: FormBuilder, public alertController: AlertController
    ,public navCtrl: NavController) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required)
    })
   }

  ngOnInit() {
    //   NativeBiometric.isAvailable().then((result)=>
    //   {if(result.isAvailable){
    //     NativeBiometric.getCredentials({ server: "fingerPrint",}).then(credent => {
    //       if(credent){
    //         if(credent.username == "Chema" && credent.password == "1234"){
    //           this.navCtrl.navigateRoot('home')
    //         }
    //       }
    //     });
    //   }
    // }).catch(()=>false);

    NativeBiometric.isAvailable().then((result)=>
      {if(result.isAvailable){
        NativeBiometric.getCredentials({ server: "fingerPrint",}).then(credent => {
          if(credent){
              this.isDisable = true
          }
        });
      }
    }).catch(()=>false);
  }

  // credential(){
  //   return new Promise((resolve,rejects) => {
  //   NativeBiometric.getCredentials({
  //     server: "fingerPrint",
  //   })
  //     .then(result => {
  //       if(result){
  //         resolve({username: result.username,
  //                 password: result.password
  //               });
  //       }
  //       else{
  //         resolve(null);
  //       }
  //     }).catch(error => {
  //       this.alertController.create({
  //         header: 'Error',
  //         subHeader: 'No se pudieron recuperar las credenciales',
  //         message: 'Hubo un problema al intentar recuperar las credenciales.',
  //         buttons: ['OK']
  //       }).then(alert => alert.present());
  //        rejects(error);
  //     })
  //   });
  // }

  async iniciar(){
    var f = this.formularioLogin.value;
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
