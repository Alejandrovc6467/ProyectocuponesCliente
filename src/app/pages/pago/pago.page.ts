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
  fechaVencimientoControl!: FormControl;
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

    this.fechaVencimientoControl = this.realizarPagoForm.get(
      'fechaVencimiento') as FormControl;
    

    this.calcularMontoApagar();

    this.cargarAsientosEnFactura();
  }

  /*
  calcularMontoApagar() {
    const montoTotalApagara = this.cuponesSeleccionados.reduce((acc, cupon) => {
      
      const precioConImpuesto = cupon.precio * 1.13; 
      

      return acc + precioConImpuesto;
    }, 0);
    

    this.montoTotalApagar = parseFloat(montoTotalApagara.toFixed(2));
  }
    */

  calcularMontoApagar() {
    const montoTotalApagara = this.cuponesSeleccionados.reduce((acc, cupon) => {
      const precioBase = cupon.descuento > 0 ? cupon.precioConDescuento : cupon.precio;
      const precioConImpuesto = precioBase * 1.13;
  
      return acc + precioConImpuesto;
    }, 0);
  
    this.montoTotalApagar = parseFloat(montoTotalApagara.toFixed(2));
  }

  cargarAsientosEnFactura() {
    return this.cuponesSeleccionados.map(
      (cupon) => cupon.id
    );

    
  }
    

  cargarNomresCupones() {
    return this.cuponesSeleccionados.map(cupon => cupon.nombre).join(', ');
  }


  enviarCorreo (correo:string, nombreCupones:string, motonTotal:string ){
    // Llama al servicio de autenticación
    this.proyectocuponesService.enviarCorreo(correo, nombreCupones, motonTotal ).subscribe(
      (response) => {

        if(response == true){
          
         console.log("Correo enviado");

        
        }else{

          console.log("Correo enviado");
        
        }

        
      },
      (error) => {

        // Manejar el error
        
        console.error('Ocurrio un error al enviar el correo:', error);

      }
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


      if(!this.validarFechaVencimiento(fechaVencimiento)){
          alert("Fecha invalida");
          return;
      }

      if(!this.validarFechaVencimientoMayorActual(fechaVencimiento)){
          alert("La fecha de vencimiento debe ser mayor que la actual");
          return;
      }

      if(!this.validarCVV(cvv)){
        alert("El CVV debe conteber solo tres numeros");
        return
      }

      var tarjetaEncriptada=this.proyectocuponesService.encrypt(numeroTargeta);
      console.log(tarjetaEncriptada);

      var cuponesID=this.cargarAsientosEnFactura();

       // Llama al servicio de autenticación
      this.proyectocuponesService.registrarVenta( cuponesID,tarjetaEncriptada,correo ).subscribe(
        (response) => {

          if(response == true){
            
          

            this.alertController.create({
              header: 'Genial!',
              message: "Venta realizada con exito!",
              buttons: ['OK']
            }).then(alert => {
                alert.present();
            })
          

            
            localStorage.setItem('datosCarrito', JSON.stringify([]));

            var nombreCupones = this.cargarNomresCupones();
            this.enviarCorreo (correo, nombreCupones, this.montoTotalApagar.toString() );

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


  validarFechaVencimiento(fechaVencimiento: string): boolean {
    // Expresión regular para validar la fecha de vencimiento (MM/AA)
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
    // Verificar si la fecha de vencimiento cumple con el formato MM/AA
    return regex.test(fechaVencimiento);
  }

  validarCVV(cvv: string): boolean {
    // Expresión regular para validar el CVV (3 dígitos numéricos)
    const regex = /^\d{3}$/;
  
    // Verificar si el CVV cumple con el formato de 3 dígitos
    return regex.test(cvv);
  }


  validarFechaVencimientoMayorActual(fechaVencimiento: string): boolean {
    const fechaActual = new Date();
    const [mes, anio] = fechaVencimiento.split('/');
    const fechaVencimientoObj = new Date(parseInt(anio, 10) + 2000, parseInt(mes, 10) - 1);
  
    // Verificar si la fecha de vencimiento es mayor que la fecha actual
    return fechaVencimientoObj > fechaActual;
  }
 


  aplicarMascaraFechaVencimiento(event: any) {
    let valor = event.target.value;
  
    // Eliminar cualquier carácter que no sea un dígito o un guión
    valor = valor.replace(/[^\d\/]/g, '');
  
    valor = valor.slice(0, 5); // Limitar la longitud de la cadena a 5 caracteres (MM/AA)
  
    // Insertar el guión automáticamente
    if (valor.length > 2 && valor.charAt(2) !== '/') {
      valor = valor.slice(0, 2) + '/' + valor.slice(2);
    }
  
    // Actualizar el valor del input con la máscara aplicada
    event.target.value = valor;
    this.fechaVencimientoControl.setValue(valor, { emitEvent: false }); // Actualizar el control de formulario
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
