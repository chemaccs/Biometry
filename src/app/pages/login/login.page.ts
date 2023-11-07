import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';
import { BiometricService } from 'src/app/service/biometric.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  isAvailable: Boolean = false;
  
  constructor(public fb: FormBuilder, public alertController: AlertController
    ,public navCtrl: NavController, private  biometricService: BiometricService) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required)
    })
   }

  ngOnInit() {
    this.biometricService.isBioConfigured().then((booleanBiometric)=>{
      if(booleanBiometric){
        this.isAvailable = true
      }
    });
  }
  
  async iniciar(){
    var formulario = this.formularioLogin.value;
    this.biometricService.loginUpAPI(formulario.nombre,formulario.password).then(asnwer => {
      if(asnwer){
          this.navCtrl.navigateRoot('home');
        }
      else{
          this.biometricService.alertLoginIncorrect();
        }
      });
    }

  async fingerPrint(){
    this.biometricService.fingerPrint();
    }

}
