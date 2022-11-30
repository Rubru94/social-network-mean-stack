import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VideogameComponent } from './components/videogame/videogame.component';
import { PublicComponent } from './public.component';

@NgModule({
    declarations: [PublicComponent, HomeComponent, LoginComponent, RegisterComponent, VideogameComponent],
    imports: [CommonModule, PublicRoutingModule, SharedModule]
})
export class PublicModule {}
