import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FollowListComponent } from './components/follow-list/follow-list.component';
import { PeopleComponent } from './components/people/people.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';
import { MessagingModule } from './messaging/messaging.module';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';

@NgModule({
    declarations: [
        PrivateComponent,
        UserSettingsComponent,
        PeopleComponent,
        UserSidebarComponent,
        TimelineComponent,
        UserProfileComponent,
        FollowListComponent
    ],
    imports: [CommonModule, PrivateRoutingModule, SharedModule, MessagingModule]
})
export class PrivateModule {}
