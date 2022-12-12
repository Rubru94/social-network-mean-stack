import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/shared.module';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { PeopleComponent } from './components/people/people.component';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { MomentModule } from 'ngx-moment';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FollowListComponent } from './components/follow-list/follow-list.component';

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
    imports: [
        CommonModule,
        PrivateRoutingModule,
        SharedModule,
        MomentModule.forRoot({
            relativeTimeThresholdOptions: {
                m: 59
            }
        })
    ]
})
export class PrivateModule {}
