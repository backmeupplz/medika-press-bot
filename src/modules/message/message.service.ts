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

  async sendMessage(id: string) {
    await this.bot.telegram.sendMessage(
      this.configService.get<string>('CHAT_ID'),
      `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    );
  }
}
