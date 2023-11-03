import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { BiometricService } from 'src/app/biometric.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  isDisable: Boolean = false;
  
  constructor(public fb: FormBuilder, public alertController: AlertController
    ,public navCtrl: NavController, private  biometricService: BiometricService) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required)
    })
   }

  ngOnInit() {
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
  
  async iniciar(){
    this.biometricService.alertLogin(this.formularioLogin);
  }    
      
  async fingerPrint(){
    this.biometricService.fingerPrint();
    }
}
