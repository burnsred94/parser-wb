import { Ctx, Message, On, Start, Update, Use } from 'nestjs-telegraf';
import * as fs from 'fs';
import * as path from 'path';

import { Action, StatusUserBot, TelegrafContext } from './interfaces/telegraf-context.interfaces';
import { InitializerService } from './modules/initializer/initializer.service';
import { keyboardsAction } from './modules/initializer/utils/keyboards';
import { UserService } from './modules/user/user.service';
import { TaskManager, TaskManagerService } from './modules/task-manager/task-manager.service';
import { Cron } from '@nestjs/schedule';
import { AuthService } from './modules/auth/auth.service';
import { StatsService } from './modules/stats/stats.service';
import { initState } from './utils/init-sesion-state';




@Update()
export class AppService {
  cronTasks: TaskManager[]
  date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

  userId: number;

  constructor(
    private readonly initializerService: InitializerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly taskManagerService: TaskManagerService = new TaskManagerService(),
    private readonly statsService: StatsService
  ) {
    this.cronTasks = [];
  }

  @Use()
  async middleware(ctx: TelegrafContext, next: () => Promise<void>) {

    ctx.session.stats !== null ? null : await initState(ctx)

    ctx.session.stats.date === null || ctx.session.stats.date !== this.date ? ctx.session.stats.date = this.date : ctx.session.stats.date = ctx.session.stats.date;

    const checkUserInDb = await this.userService.findByTelegram(ctx.session.user);
    const checkUserApi = await this.authService.authLogin(ctx.session.user);


    if (!checkUserInDb) {
      ctx.session.statusUser = StatusUserBot['NOT_REGISTERED'];
    }

    if (checkUserInDb && checkUserApi === StatusUserBot['REGISTERED_BOT']) {
      ctx.session.statusUser = StatusUserBot['REGISTERED_BOT'];
    }

    if (ctx.session.statusUser === StatusUserBot['REGISTERED_BOT']) {
      const user = await this.authService.authLogin(ctx.session.user);
      ctx.session.statusUser = user
    }

    await next();
  }

  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    ctx.session.stats ? null : await initState(ctx);


    this.userId = ctx.from.id;
    ctx.session.stats.start_bot += 1;

    ctx.session.stats.start_bot > 1 ? null : await this.statsService.stats({ start_bot: ctx.session.stats.start_bot })


    const task = this.taskManagerService.fabric(this.userId)
    this.cronTasks.push(task);

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
  async getMessage(@Message('text') message: string, @Ctx() ctx: TelegrafContext) {

    if (ctx.session.state === 'register') {
      const response = await this.initializerService.registerInit(ctx);

      response.state === Action['REGISTER_SUCCESS'] ? ctx.session.state = Action['REGISTER_SUCCESS'] : ctx.session.state = Action['REGISTER'];

      if (response.state === Action['REGISTER_SUCCESS']) {
        ctx.session.stats.success_registration += 1
      }

      if (ctx.session.state === Action['REGISTER_SUCCESS'] && ctx.session.stats.success_registration > 0) {
        await this.statsService.stats({
          success_registration: ctx.session.stats.success_registration
        })
      }

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

    if (ctx.session.state === Action['AI_COPYWRITER']) {
      ctx.session.state = Action['AI_COPYWRITER'];


      const messageAndKeyboard = await keyboardsAction('AI_COPYWRITER');

      const { tickDescription, tickKeywords, tickName } = ctx.session.copywriting_data

      if (ctx.session.state === Action['AI_COPYWRITER'] && ctx.session.stats.start_generation_button === 0) {
        ctx.session.stats.start_generation_button += 1

        await this.statsService.stats({
          start_generation_button: ctx.session.stats.start_generation_button
        });
      }

      if (!tickName) {
        ctx.session.copywriting_data.name = message
        ctx.session.copywriting_data.tickName = true
        await ctx.reply('<b>Введите описание товара</b>\n\n <i>например "\для детей и взрослых, демисезонная, черная\"</i>', {
          parse_mode: 'HTML',
        })
      }

      if (tickName && !tickDescription && !tickKeywords) {
        ctx.session.copywriting_data.description = message
        ctx.session.copywriting_data.tickDescription = true
        await ctx.reply('<b>Введите ключевые слова</b>\n\n<i>цвет - желтый, размер - s, m, l, xl, застежка - молния, стильная и яркая</i>', {
          parse_mode: 'HTML',
        })
      }

      if (tickName && tickDescription && !tickKeywords) {
        ctx.session.copywriting_data.keywords = message
        ctx.session.copywriting_data.tickKeywords = true

        await ctx.reply('Генерация может занять некоторе время... 🤞🏽')
        const response = await this.initializerService.getAiDataBot(ctx);

        if (response) {
          if (ctx.session.stats.start_generation_button > 0) {
            ctx.session.stats.regenerate_button += 1

            await this.statsService.stats({
              regenerate_button: ctx.session.stats.regenerate_button
            });
          }

          await ctx.reply(response.text);
          await ctx.reply(messageAndKeyboard.message, messageAndKeyboard.keyboard);
        }
      }

    }
  }

  // @Cron('* * * * *')
  // async messageRegister(@Ctx() ctx: TelegrafContext) {
  //     await this.cronTasks.find((task) => task.messageEmailRegister())
  // }

}
