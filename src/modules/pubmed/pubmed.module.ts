import { HttpModule, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { PubmedService } from './pubmed.service';

@Module({
  imports: [HttpModule, MessageModule],
  providers: [PubmedService],
})
export class PubmedModule {}
