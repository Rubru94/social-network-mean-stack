import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivedMessagesComponent } from './components/received-messages/received-messages.component';
import { SendingComponent } from './components/sending/sending.component';
import { SentMessagesComponent } from './components/sent-messages/sent-messages.component';

const routes: Routes = [
    { path: '', redirectTo: 'received/1', pathMatch: 'full' },
    { path: 'sending', component: SendingComponent },
    { path: 'received', redirectTo: 'received/1', pathMatch: 'full' },
    { path: 'received/:page', component: ReceivedMessagesComponent },
    { path: 'sent', redirectTo: 'sent/1', pathMatch: 'full' },
    { path: 'sent/:page', component: SentMessagesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagingRoutingModule {}
