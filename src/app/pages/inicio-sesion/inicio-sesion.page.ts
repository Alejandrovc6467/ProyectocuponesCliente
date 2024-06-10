import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { ProyectocuponesService } from 'src/app/services/proyectocupones.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private ProyectocuponesService: ProyectocuponesService
  ) {
    this.loginForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Lógica de inicio de sesión
      console.log('Inicio de sesión:', this.loginForm.value);

      // Llama al servicio de autenticación
      this.ProyectocuponesService.login(email, password).subscribe(
        (response) => {

          if(response == true){


            const sesionUser = {
              email: email
            };

            localStorage.setItem("sesionUser", JSON.stringify(sesionUser));



            const usuario = localStorage.getItem('sesionUser');
            if (usuario) {
              const user = JSON.parse(usuario);
              console.log("email guardado en local");
              console.log(user.email);
            }
        
            
            // Redirigir al usuario a la página de cupones
            this.navCtrl.navigateForward(['/cupones']);

          }else{

            // Mostrar los datos en un alert
            this.alertController.create({
              header: 'Ooops!',
              message: "Datos incorrectos",
              buttons: ['OK']
            }).then(alert => {
                alert.present();
            })
          
          }

          
        },
        (error) => {

          // Manejar el error
          console.error('Error de inicio de sesión:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
  register() {
    this.navCtrl.navigateForward(['/registro']);
  }



}
