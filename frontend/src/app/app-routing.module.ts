import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PrivateComponent } from './private/private.component';
import { PublicComponent } from './public/public.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        component: PublicComponent,
        loadChildren: () => import('./public/public.module').then((m) => m.PublicModule)
    },
    {
        path: 'private',
        component: PrivateComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./private/private.module').then((m) => m.PrivateModule)
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
