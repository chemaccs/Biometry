import { Injectable } from '@angular/core';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";

@Injectable({
  providedIn: 'root'
})
export class AuthApiServiceService {

  username: string = "";
  password: string = "";
  /**
   * Login
   * @description Se comparan el usuaro y la contraseña con el usuario y la contraseña del almacén seguro.
   * @returns Promise<Boolean>
   */
  async login(user: string, password: string): Promise<Boolean>{
    var usuarioString = localStorage.getItem('usuario');
      if (usuarioString !=null){
        var usuario= JSON.parse(usuarioString);
        if(user == usuario.nombre && password == usuario.password){
            return true;
          }
        else{
            return false
          }
      }
      else{
        return false
      }
    }
  /**
   * Registro
   * @description Se guarda un usuario en el almacen seguro, que será el que se use para registrar al usuario en
   *              la página de sinup, y además de allí sacaremos los datos para activar la biometría
   * @returns Promise<Boolean>
   */
  async register(user: any, password: any): Promise<Boolean>{
    let usuario = {
      nombre: user,
      password: password
    }
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.username= user;
    this.password= password;
    return true
  }

  /**
   * Cambio de contraseña
   * @description Se cambia la contraseña del usuario, comprobando antes que el usuario que le envias 
   *              coincide con el usuario del almacén seguro
   * @returns Promise<void>
   */
  async changePassword(user: string, pass: string): Promise<void>{
    if(this.username == user){    
      NativeBiometric.setCredentials({   
        username: user,
        password: pass,
        server: "DatosAlmacenSeguro",
      }).then();  
    }
  }
}
