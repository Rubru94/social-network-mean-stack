import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowListComponent } from './components/follow-list/follow-list.component';
import { PeopleComponent } from './components/people/people.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
    { path: 'settings', component: UserSettingsComponent },
    { path: 'people', redirectTo: 'people/1', pathMatch: 'full' },
    { path: 'people/:page', component: PeopleComponent },
    { path: 'following-list', redirectTo: 'following-list/1', pathMatch: 'full' },
    { path: 'following-list/:page', component: FollowListComponent },
    { path: 'follower-list', redirectTo: 'follower-list/1', pathMatch: 'full' },
    { path: 'follower-list/:page', component: FollowListComponent },
    { path: 'timeline', component: TimelineComponent },
    { path: 'profile', redirectTo: 'profile/', pathMatch: 'full' },
    { path: 'profile/:id', component: UserProfileComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateRoutingModule {}
