import { Component, OnInit } from '@angular/core';
import { ProyectocuponesService, Cupon } from 'src/app/services/proyectocupones.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  cupones: Cupon[]=[];

  constructor(private proyectocuponesService:ProyectocuponesService) { }

  ngOnInit() {

    var correo = "";
    const usuario = localStorage.getItem('sesionUser');
    if (usuario) {
      const userEmail = JSON.parse(usuario);
      console.log("email guardado en local");
      console.log(userEmail.email);
      correo = userEmail.email;
    }

    this.proyectocuponesService.obtenerCuponesCorreo(correo).subscribe(
      (data: Cupon[]) => {
        this.cupones = data;
        console.log('Zonas obtenidas:', this.cupones);
      },
      (error) => {
        console.error('Error al obtener conciertos:', error);
      }
    );
  }

}
