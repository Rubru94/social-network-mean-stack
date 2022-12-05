import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './components/people/people.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
    { path: 'settings', component: UserSettingsComponent },
    { path: 'people', component: PeopleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateRoutingModule {}
