import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectocuponesService } from 'src/app/services/proyectocupones.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage  {
  registroForm: FormGroup;


  

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private ProyectocuponesService: ProyectocuponesService
  ) 
  {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula:['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  //validaciones
  aplicarMascaraCedula(event: any) {
    let valor = event.target.value;

    // Eliminar cualquier carácter que no sea un dígito o un guión
    valor = valor.replace(/[^\d-]/g, '');

    valor = valor.slice(0, 11); // Limitar la longitud de la cadena a 11 caracteres (0-0000-0000)

    // Insertar el guión automáticamente
    if (valor.length > 1 && valor.charAt(1) !== '-') {
      valor = valor.slice(0, 1) + '-' + valor.slice(1);
    }
    if (valor.length > 6 && valor.charAt(6) !== '-') {
      valor = valor.slice(0, 6) + '-' + valor.slice(6);
    }

    // Actualizar el valor del input con la máscara aplicada
    event.target.value = valor;
    this.registroForm.get('cedula')?.setValue(valor, { emitEvent: false }); // Actualizar el control de formulario
  }

  validarContrasena(contrasena: string): boolean {
    // Expresión regular para validar la contraseña
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Verificar si la contraseña cumple con los requisitos
    return regex.test(contrasena);
  }



  registro() {
    if (this.registroForm.valid) {
      const { nombre, apellidos, cedula, fechaNacimiento, email, password} = this.registroForm.value;

      // Lógica de inicio de sesión
      console.log('registrar:', this.registroForm.value);


      /////  validaciones

      if(nombre.length>11){
        alert("El nombre no debe de sobrepasar los 11 caracteres")
        return;
      }

      if(apellidos.length>30){
        alert("Los apellidos no deben sobrepasar los 30 caracteres")
        return;
      }


      if(cedula.length<11){
          alert("La cedula no cumple con el formato")
          return;
      }

      if(!this.validarContrasena(password)){
          alert("La contraseña no tiene los requerimientos");
          return;
      }

    

      
      // Llama al servicio de autenticación
      this.ProyectocuponesService.registrarCliente( nombre, apellidos, cedula, fechaNacimiento, email, password ).subscribe(
        (response) => {

          if(response == true){
            
           
            this.alertController.create({
              header: 'Genial!',
              message: "Usuario registrado",
              buttons: ['OK']
            }).then(alert => {
                alert.present();
            })
          

          }else{

            // Mostrar los datos en un alert
            this.alertController.create({
              header: 'Ooops!',
              message: "Ocurrio un error",
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
  
}
