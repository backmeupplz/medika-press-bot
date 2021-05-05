import { Update, Ctx, Help } from 'nestjs-telegraf';
import { TelegrafContext } from './interfaces/telegraf-context.interface';

@Update()
export class AppUpdate {
  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Hey there!');
  }
}
