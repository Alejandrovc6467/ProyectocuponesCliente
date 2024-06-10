import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ProyectocuponesService,
  Cupon,
} from 'src/app/services/proyectocupones.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  numeroTargetaControl!: FormControl;
  realizarPagoForm: FormGroup;
  cuponesSeleccionados: Cupon[] = []; // Suponiendo que tienes un array de cupones seleccionados
  asientosAmostrarEnFactura: string = '';

  concierto: any;
  montoTotalApagar: number=0;

  constructor(
    private fb: FormBuilder,
    private proyectocuponesService: ProyectocuponesService,
    private alertController: AlertController
  ) {
    this.realizarPagoForm = this.fb.group({
      nombreTargeta: ['', Validators.required],
      numeroTargeta: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      cvv: ['', Validators.required],
    });

    var carrito = localStorage.getItem('datosCarrito');
    if (carrito) {
      const conci = JSON.parse(carrito);
      console.log('Concierto guardado en local');
      console.log(conci);
      this.cuponesSeleccionados = conci;
    }
  }

  ngOnInit() {
    this.numeroTargetaControl = this.realizarPagoForm.get(
      'numeroTargeta'
    ) as FormControl;

    this.calcularMontoApagar();

    this.cargarAsientosEnFactura();
  }

  calcularMontoApagar() {
    const montoTotalApagara = this.cuponesSeleccionados.reduce((acc, cupon) => {
      
      const precioConImpuesto = cupon.precio * 1.13; 
      

      return acc + precioConImpuesto;
    }, 0);
    

    this.montoTotalApagar = parseFloat(montoTotalApagara.toFixed(2));
  }

  cargarAsientosEnFactura() {
    return this.cuponesSeleccionados.map(
      (cupon) => cupon.id
    );

    
  }

  realizarPago() {
    if (this.realizarPagoForm.valid) {
      const { nombreTargeta, numeroTargeta,  fechaVencimiento, cvv } = this.realizarPagoForm.value;


      
 
      console.log('datos de venta:', this.realizarPagoForm.value);

      var correo = "";
      const usuario = localStorage.getItem('sesionUser');
      if (usuario) {
        const userEmail = JSON.parse(usuario);
        console.log("email guardado en local");
        console.log(userEmail.email);
        correo = userEmail.email;
      }
    //aqui llamar al funcion lunh

    if(this.validarLuhn(numeroTargeta)){
      console.log("targeta valida");


      var cuponesID=this.cargarAsientosEnFactura();

       // Llama al servicio de autenticación
       this.proyectocuponesService.registrarVenta( cuponesID,numeroTargeta,correo ).subscribe(
        (response) => {

          if(response == true){
            
          

            this.alertController.create({
              header: 'Genial!',
              message: "Venta realizada con exito!",
              buttons: ['OK']
            }).then(alert => {
                alert.present();
            })
          

          }else{

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
          console.error('Ocurrio un error:', error);
        }
      );


    }else{
      console.log("targeta Invalida");
      this.alertController.create({
        header: 'Ooops!',
        message: "Targeta Invalida",
        buttons: ['OK']
      }).then(alert => {
          alert.present();
      })
    
    }

  
      
     
      
    } else {
      console.log('Formulario inválido');
    }
  }

  aplicarMascaraNumeroTarjeta(event: any) {
    let valor = event.target.value;

    // Eliminar cualquier carácter que no sea un dígito o un guión
    valor = valor.replace(/[^\d-]/g, '');

    valor = valor.slice(0, 19); // Limitar la longitud de la cadena a 19 caracteres (####-####-####-####)

    // Insertar los guiones automáticamente
    if (valor.length > 4 && valor.charAt(4) !== '-') {
      valor = valor.slice(0, 4) + '-' + valor.slice(4);
    }
    if (valor.length > 9 && valor.charAt(9) !== '-') {
      valor = valor.slice(0, 9) + '-' + valor.slice(9);
    }
    if (valor.length > 14 && valor.charAt(14) !== '-') {
      valor = valor.slice(0, 14) + '-' + valor.slice(14);
    }

    // Actualizar el valor del input con la máscara aplicada
    event.target.value = valor;
    this.numeroTargetaControl.setValue(valor, { emitEvent: false }); // Actualizar el control de formulario
  }

  validarLuhn(tarjeta: string): boolean {
    let datos = tarjeta.split('-');
    let numero = ' ' + datos[0] + datos[1] + datos[2] + datos[3];
    numero = numero.toString().replace(/\s/g, '');

    let digitos = numero.split('').map(Number);
    digitos.reverse();

    let suma = digitos.reduce((total, valor, indice) => {
      if (indice % 2 === 1) {
        valor *= 2;
        if (valor > 9) {
          valor -= 9;
        }
        total += valor;
      }
      return total;
    }, 0);

    suma += digitos.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);

    return suma % 10 === 0;
  }
}
