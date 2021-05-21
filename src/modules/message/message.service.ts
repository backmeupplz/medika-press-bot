import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/interfaces/telegraf-context.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectBot() private readonly bot: TelegrafContext,
    private readonly configService: ConfigService,
  ) {}

  sendMessage(text: string) {
    return this.bot.telegram.sendPhoto(
      this.configService.get<string>('CHAT_ID'),
      { url: 'https://source.unsplash.com/collection/4415448/1600x900' },
      { parse_mode: 'HTML', caption: text },
    );
  }
}
