import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
    declarations: [NavbarComponent, TruncatePipe],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        MomentModule.forRoot({
            relativeTimeThresholdOptions: {
                m: 59
            }
        })
    ],
    exports: [ReactiveFormsModule, HttpClientModule, NavbarComponent, MomentModule, TruncatePipe]
})
export class SharedModule {}
