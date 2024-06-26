import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ProyectocuponesService {

  private urlLogin='https://localhost:5080/api/Cliente';
  private urlRegistrarCliente='https://localhost:5080/api/Cliente';
  private UrlObtenerCupones='http://localhost/ProyectoCupones/CuponesCliente.php';
  private urlRealizarVenta='https://localhost:5080/api/CompraCupones';
  private urlObtenerCuponesCorreo='https://localhost:5080/api/Cupon';
  private urlObtenerCategorias='http://localhost/ProyectoCupones/Categorias.php';


  private apiUrlEnviarEmail = 'https://localhost:5080/api/Correo';


  private key: string = '01234567890123456789012345678901'; // Debe ser almacenado de manera segura


  constructor(private http: HttpClient) { }


  encrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const result = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    return result;
  }


  login(email: string, password: string): Observable<any> {
    // Construir la URL con los parámetros de email y contraseña
    const url =  `${this.urlLogin}/${encodeURIComponent(email)},${encodeURIComponent(password)}`;
    
    // No es necesario enviar datos en el cuerpo de la solicitud si ya están en la URL
    return this.http.get(url);
  }


  

  registrarCliente(nombre: string, apellidos: string, cedula:string, fechaNacimiento:string, correo:string, contrasenia:string): Observable<any> {
    // Construir la URL con los parámetros de email y contraseña
   

    const clienteData = {
      nombre: nombre,
      apellidos: apellidos,
      cedula: cedula,
      fechaNacimiento: fechaNacimiento,
      correo: correo,
      contrasena: contrasenia
    };

    // No es necesario enviar datos en el cuerpo de la solicitud si ya están en la URL
  
    return this.http.post(this.urlRegistrarCliente, clienteData);
  }


  obtenerConciertos(): Observable<Cupon[]> {
    return this.http.get<Cupon[]>(this.UrlObtenerCupones);
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlObtenerCategorias);
  }

  obtenerCuponesCorreo(correo: string): Observable<Cupon[]> {

    const url = `${this.urlObtenerCuponesCorreo}/${encodeURIComponent(correo)}`;

    //return this.http.get<Concierto[]>(url);
  
    
    return this.http.get<Cupon[]>(url).pipe(
      catchError(this.handleError<Cupon[]>('obtenerReservas', []))
    );
    
  }

  enviarCorreo(correo: string, nombreCupones:string, motonTotal: string): Observable<any> {
    
    const data = {
      correo: correo,
      nombreCupones: nombreCupones,
      montoTotal: motonTotal
    };

   
    
    return this.http.post(this.apiUrlEnviarEmail, data);

  }

  registrarVenta( cuponesID: number [],tarjeta:string ,correo: string): Observable<any> {
    
    const data = {
      cuponesID:cuponesID,
      tarjeta:tarjeta,
      correo: correo
      
    };
    
    return this.http.post(this.urlRealizarVenta, data);
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}





export interface Cupon {
  id: number;
  nombre: string;
  imagenUrl: string;
  precio: number;
  idEmpresa: number;
  activo: boolean;
  fechaHabilitado: Date;
  fechaCaducado: Date;
  idCategoria: number;
  nombreCategoria: string;
  descuento: number;
  precioConDescuento: number;
  fechaCaducidadPromocion: Date;
  ubicacionEmpresa: string;
}

export interface Categoria{
  id:number;
  nombre: string;
  activo:number;
}


