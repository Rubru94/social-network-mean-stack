import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [NavbarComponent],
    imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
    exports: [ReactiveFormsModule, HttpClientModule, NavbarComponent]
})
export class SharedModule {}
