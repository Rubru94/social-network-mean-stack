import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { SharedModule } from '../shared/shared.module';
import { VideogameComponent } from './components/videogame/videogame.component';

@NgModule({
    declarations: [PublicComponent, VideogameComponent],
    imports: [CommonModule, PublicRoutingModule, SharedModule]
})
export class PublicModule {}
