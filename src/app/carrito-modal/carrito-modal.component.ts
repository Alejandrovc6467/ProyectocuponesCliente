import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cupon } from '../services/proyectocupones.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.component.html',
  styleUrls: ['./carrito-modal.component.scss'],
})
export class CarritoModalComponent {
  @Input() cupones: Cupon[] = [];
  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private navCtrl: NavController  
  ) {}

  /*
  get total(): number {
    return this.cupones.reduce(
      (acc, cupon) => acc + parseFloat(cupon.precio.toString()),
      0
    );
  }
    */

  get total(): number {
    return this.cupones.reduce((acc, cupon) => {
      const precioAUtilizar = cupon.descuento > 0 ? cupon.precioConDescuento : cupon.precio;
      return acc + parseFloat(precioAUtilizar.toString());
    }, 0);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  realizarCompra() {
    // Lógica para realizar la compra
    console.log('Compra realizada');
    if (this.total===0) {
      this.alertController.create({
        header: 'Ooops!',
        message: "No has escogido un cupón por el cual puedas pagar.",
        buttons: ['OK']
      }).then(alert => {
          alert.present();
      })
    }else{
    this.modalController.dismiss();
    this.navCtrl.navigateForward("/pago");
    }
  }

  limpiarCarrito() {
    // Lógica para limpiar el carrito
    this.cupones = [];
    console.log('Carrito limpiado');
    localStorage.setItem('datosCarrito', JSON.stringify(this.cupones));
  }
}
