import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SendingComponent } from './components/sending/sending.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { ReceivedMessagesComponent } from './components/received-messages/received-messages.component';
import { SentMessagesComponent } from './components/sent-messages/sent-messages.component';

@NgModule({
    declarations: [SendingComponent, ReceivedMessagesComponent, SentMessagesComponent],
    imports: [CommonModule, MessagingRoutingModule]
})
export class MessagingModule {}
