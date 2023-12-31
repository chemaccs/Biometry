import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';
import { BiometricService } from 'src/app/service/biometric.service';
import { AuthApiServiceService } from 'src/app/service/auth-api-service.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  formularioRegistro: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, public navCtrl: NavController
    , private  biometricService: BiometricService, private authApiServiceService: AuthApiServiceService) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmacionPassword': new FormControl("", Validators.required),
      'confirmacionBiometricVerification': new FormControl(false)
    });
  }
  
  ngOnInit() {
  }

  async guardar(): Promise<void>{
    let formulario= this.formularioRegistro.value;
    if(formulario.invalid){
        this.biometricService.alertControllerFormIncomplete();
    }
    else{
      this.biometricService.alertPasswordIsEquals(formulario.password,formulario.confirmacionPassword).then(result => {
        if(result){
          this.authApiServiceService.register(formulario.nombre,formulario.password);
          this.navCtrl.navigateRoot('login');
        }
      });
    }
  }
}
