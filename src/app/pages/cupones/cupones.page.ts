import { Component, OnInit } from '@angular/core';
import { ProyectocuponesService, Cupon, Categoria } from 'src/app/services/proyectocupones.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CarritoModalComponent } from 'src/app/carrito-modal/carrito-modal.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.page.html',
  styleUrls: ['./cupones.page.scss'],
})
export class CuponesPage implements OnInit {
  cuponesSeleccionados: Cupon[] = [];  // Suponiendo que tienes un array de cupones seleccionados

  cupones: Cupon[]=[];
  
  

  //nuevo
  cuponesFiltrados: Cupon[] = [];
  categoriaSeleccionada: string = 'Todo';

  categorias: Categoria[]=[];

  constructor(private proyectocuponesService: ProyectocuponesService, private navCtrl:NavController,private alertController: AlertController,private modalController: ModalController) { }

  ngOnInit() {
    this.proyectocuponesService.obtenerConciertos().subscribe(
      (data: Cupon[]) => {
        //nuevo
        this.cupones = data;
        this.filtrarCupones();

        //this.cupones = data;
        //console.log('Conciertos obtenidos:', this.cupones);
      },
      (error) => {
        console.error('Error al obtener conciertos:', error);
      }
    );


    this.proyectocuponesService.obtenerCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener las categorias:', error);
      }
    );
  }

  //nuevo
  filtrarCupones() {
    if (this.categoriaSeleccionada === 'Todo') {
      this.cuponesFiltrados = this.cupones;
    } else {
      this.cuponesFiltrados = this.cupones.filter(
        (cupon) => cupon.nombreCategoria === this.categoriaSeleccionada
      );
    }
  }


  buscarCupones(event: any) {
    
    const texto = event.target.value.toLowerCase();
    console.log(texto);
    this.cuponesFiltrados = this.cupones.filter(cupon => {
      return cupon.nombre.toLowerCase().includes(texto);
    });
  }








  async openCart() {
    var carrito = localStorage.getItem('datosCarrito');
    if (carrito) {
      const conci = JSON.parse(carrito);
      console.log("Concierto guardado en local");
      console.log(conci);

      const modal = await this.modalController.create({
        component: CarritoModalComponent,
        componentProps: { cupones: conci }
      });
      return await modal.present();
    }

   
  }


  comprarEntradas(cupon:Cupon) {

    var carrito = localStorage.getItem('datosCarrito');
    if (carrito) {
      const conci = JSON.parse(carrito);
      console.log("Concierto guardado en local");
      console.log(conci);
      this.cuponesSeleccionados=conci;
    }
    console.log(cupon);
    this.cuponesSeleccionados.push(cupon);
    localStorage.setItem("datosCarrito", JSON.stringify(this.cuponesSeleccionados));
    this.alertController.create({
      header: 'Genial!',
      message: "Producto añadido al carrito",
      buttons: ['OK']
    }).then(alert => {
        alert.present();
    })
  
  }

}
