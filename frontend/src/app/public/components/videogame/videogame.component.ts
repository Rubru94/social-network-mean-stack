import { Component } from '@angular/core';

@Component({
    selector: 'app-videogame',
    templateUrl: './videogame.component.html',
    styleUrls: ['./videogame.component.scss']
})
export class VideogameComponent {
    name: string;
    bestGame2019: string;
    retroGame: string;
    retroShow: boolean;
    games2022: string[];

    constructor() {
        this.name = 'videogame';
        this.bestGame2019 = 'Sekiro';
        this.retroGame = 'Crash Bandicoot';
        this.retroShow = true;
        this.games2022 = ['God of War: Ragnarok', 'Elden Ring', 'Sifu', 'Poinpy', 'Xenoblade Chronicles 3'];
    }
}
