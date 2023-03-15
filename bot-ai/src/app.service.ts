import { Ctx, Message, On, Start, Update, Use } from 'nestjs-telegraf';
import * as fs from 'fs';
import * as path from 'path';

import { Action, TelegrafContext } from './interfaces/telegraf-context.interfaces';
import { InitializerService } from './modules/initializer/initializer.service';
import { keyboardsAction } from './modules/initializer/utils/keyboards';


@Update()
export class AppService {

  constructor(private readonly initializerService: InitializerService) {}

  @Use()
  async middleware(ctx: TelegrafContext, next: () => Promise<void>) {
    await next();
  }

  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    ctx.session.state = null;
    const init = await this.initializerService.confirmInit(ctx);
    const link = path.join(__dirname, '../public/Ad_Banner.png')
    const sourceImg = fs.createReadStream(link)

    await ctx.replyWithPhoto({ source: sourceImg }, {
      caption: `Рады приветствовать в сервисе <b>AI-копирайтинга</b> от <a href="https://sellershub.ru/?utm_medium=smm&utm_source=tg&utm_campaign=bot_ai&utm_term=bot_button&utm_content=1">Sellershub.ru</a>\n\nСервис использует <b>искусственный интеллект</b> для написания SEO-текста для описания товара <b>используя ваши ключи</b> для товара.\n\nМы обучаем нашу модель на базе товаров Wildberries\n\n${init.message}`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: init.keyboard.reply_markup.inline_keyboard
      }
    });

  }


  @On('message')
  async getMessage(@Message('text') message:string,@Ctx() ctx: TelegrafContext) {

    if (ctx.session.state === 'register') {
      const response = await this.initializerService.registerInit(ctx);
      const init = await this.initializerService.confirmInit(ctx);

      const link = path.join(__dirname, '../public/Registration_success.png')
      const sourceImg = fs.createReadStream(link)


      await ctx.replyWithPhoto({ source: sourceImg }, {
        caption: response.message,
        parse_mode: 'HTML',
        reply_markup: init.keyboard.reply_markup,
      });  
      ctx.session.state = response.state;
    }

    if(ctx.session.state === Action['AI_COPYWRITER']){
      const messageAndKeyboard = await keyboardsAction('AI_COPYWRITER');
      const {tickDescription,tickKeywords,tickName} = ctx.session.copywriting_data

      if(!tickName) {
        ctx.session.copywriting_data.name = message
        ctx.session.copywriting_data.tickName = true
        await ctx.reply('<b>Введите описание товара</b>\n\n <i>например "\для детей и взрослых, демисезонная, черная\"</i>', {
          parse_mode: 'HTML',
        })
      }

      if(tickName && !tickDescription && !tickKeywords) {
        ctx.session.copywriting_data.description  = message
        ctx.session.copywriting_data.tickDescription = true
        await ctx.reply('<b>Введите ключевые слова</b>\n\n<i>цвет - желтый, размер - s, m, l, xl, застежка - молния, стильная и яркая</i>', {
          parse_mode: 'HTML',
        })
      }

      if(tickName && tickDescription && !tickKeywords) {
        ctx.session.copywriting_data.keywords  = message
        ctx.session.copywriting_data.tickKeywords = true

        await ctx.reply('Генерация может занять некоторе время... 🤞🏽')
        const response = await this.initializerService.getAiDataBot(ctx);
        if(response){
          await ctx.reply(response.text);
          await ctx.reply(messageAndKeyboard.message, messageAndKeyboard.keyboard);
        }
      }

    }
  }

}
