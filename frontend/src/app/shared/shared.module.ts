import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [NavbarComponent],
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
    exports: [ReactiveFormsModule, HttpClientModule, NavbarComponent]
})
export class SharedModule {}
