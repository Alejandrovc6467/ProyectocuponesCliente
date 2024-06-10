import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; //importar esto para los forms

import { InicioSesionPageRoutingModule } from './inicio-sesion-routing.module';

import { InicioSesionPage } from './inicio-sesion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,// ponerlo aqui obvio
    InicioSesionPageRoutingModule
  ],
  declarations: [InicioSesionPage]
})
export class InicioSesionPageModule {}
