import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SanitizerPipe } from './pipes/sanitizer.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
    declarations: [NavbarComponent, TruncatePipe, SanitizerPipe],
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
    exports: [ReactiveFormsModule, HttpClientModule, NavbarComponent, MomentModule, SanitizerPipe, TruncatePipe]
})
export class SharedModule {}
