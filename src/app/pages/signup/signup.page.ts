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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  formularioRegistro: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, public navCtrl: NavController) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmacionPassword': new FormControl("", Validators.required),
      'confirmacionBiometricVerification': new FormControl(false)
    });
  }
  
  ngOnInit() {
  }

  async guardar(){
    var f = this.formularioRegistro.value;

    if(this.formularioRegistro.invalid){
      const alert = await this.alertController.create({
        header:'Datos incompletos',
        message: 'This is an alert!',
        buttons: ['Aceptar'],
      });

      await alert.present();
      return
    }

    var usuario = {
      nombre: f.nombre,
      password: f.password
    }
    localStorage.setItem('usuario', JSON.stringify(usuario))
    this.navCtrl.navigateRoot('login')
      // const result= await this.performBiometricVerification();
      // return result
    }
  
  // async performBiometricVerification(){
  //   console.log("fjfj")
  //   const result = await NativeBiometric.isAvailable();
      
  //   if(!result.isAvailable) return;
    
  //   const FINGERPRINT = result.biometryType == BiometryType.FINGERPRINT;
  //   const verified = await NativeBiometric.verifyIdentity({
  //     reason: "For easy log in",
  //     title: "Log in",
  //     subtitle: "Maybe add subtitle here?",
  //     description: "Maybe a description too?",
  //   })
  //   .then(() => true)
  //   .catch(() => false);
    
  //   if(!verified) return;
  //   const credentials = await NativeBiometric.getCredentials({
  //     server: "pepepepe",
  //   });
  // }
}
