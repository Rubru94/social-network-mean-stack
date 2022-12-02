import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [{ path: 'settings', component: UserSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateRoutingModule {}
