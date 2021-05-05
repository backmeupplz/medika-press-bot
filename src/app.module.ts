import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { PubmedModule } from './modules/pubmed/pubmed.module';
import { MessageService } from './modules/message/message.service';
import { MessageModule } from './modules/message/message.module';
import { AppUpdate } from './app.update';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PubmedModule,
    MessageModule,
  ],
  providers: [MessageService, AppUpdate],
})
export class AppModule {}
