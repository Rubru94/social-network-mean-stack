import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    title: string;

    constructor() {
        this.title = 'Register';
    }

    ngOnInit() {
        console.log(`Componente ${this.title} cargado`);
    }
}
