import { Component } from '@angular/core';

@Component({
    selector: 'app-videogame',
    templateUrl: './videogame.component.html',
    styleUrls: ['./videogame.component.scss']
})
export class VideogameComponent {
    name = 'videogame';
    bestGame2019 = 'Sekiro';
    retroGame = 'Crash Bandicoot';
    retroShow = true;
}
