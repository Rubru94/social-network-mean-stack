import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [NavbarComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [ReactiveFormsModule, NavbarComponent]
})
export class SharedModule {}
