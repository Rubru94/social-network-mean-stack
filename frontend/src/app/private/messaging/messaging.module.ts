import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceivedMessagesComponent } from './components/received-messages/received-messages.component';
import { SendingComponent } from './components/sending/sending.component';
import { SentMessagesComponent } from './components/sent-messages/sent-messages.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';

@NgModule({
    declarations: [MessagingComponent, SendingComponent, ReceivedMessagesComponent, SentMessagesComponent],
    imports: [CommonModule, MessagingRoutingModule, SharedModule],
    exports: [SendingComponent, ReceivedMessagesComponent, SentMessagesComponent]
})
export class MessagingModule {}
