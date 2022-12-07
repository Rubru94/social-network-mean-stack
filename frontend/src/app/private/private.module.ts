import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/shared.module';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { PeopleComponent } from './components/people/people.component';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';

@NgModule({
    declarations: [PrivateComponent, UserSettingsComponent, PeopleComponent, UserSidebarComponent],
    imports: [CommonModule, PrivateRoutingModule, SharedModule]
})
export class PrivateModule {}
