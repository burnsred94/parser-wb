import { Action, Command, Ctx, Message, On, Start, Update, Use } from 'nestjs-telegraf';

import { Action as ActionState, StatusUserBot, TelegrafContext } from './interfaces/telegraf-context.interfaces';
import { InitializerService } from './modules/initializer/initializer.service';
import { UserService } from './modules/user/user.service';
import { AuthService } from './modules/auth/auth.service';
import { StatsService } from './modules/stats/stats.service';
import { SessionsService } from './modules/sessions/sessions.service';
import { Session } from './modules/sessions/schemas/sessions.schema';
import { CopywritingService } from './modules/sessions/schemas/copywrite-data.schema';
import { ValidatorService } from './modules/validator/validator.service';
import { SessionStats } from './modules/sessions/schemas/sessions-stats.schema';
import { LoginSession } from './modules/sessions/schemas/session-login.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Telegram } from 'telegraf';
import * as path from 'path';
import * as fs from 'fs';




@Update()
export class AppService {
  date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  copywriting = new CopywritingService().createCopywritingSession()
  configService: ConfigService
  bot: Telegram


  constructor(
    private readonly initializerService: InitializerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly sessionService: SessionsService,
    private readonly validatorService: ValidatorService,
  ) {
    this.configService = new ConfigService();
    this.bot = new Telegram(this.configService.get('TOKEN_PROD_TELEGRAM'));
  }

  @Use()
  async middleware(ctx: TelegrafContext, next: () => Promise<void>) {
    await next();
  }

  @Action('start')
  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    const { id, username } = ctx.message ? ctx.message.from : ctx.callbackQuery.from

    const findUserTelegram = await this.userService.findByTelegramId(id);

    await this.statsService.stats({ start_bot: 1 })

    if (findUserTelegram) {
      const findSessionTelegram = await this.sessionService.findOne(id);

      if (findSessionTelegram?.date === this.date && findSessionTelegram !== null) {
        await this.sessionService.findOneAndUpdate(id, {
          copywriting_data: this.copywriting,
        })

        const init = await this.initializerService.initStartKeyboard(findSessionTelegram.statusUser)

        if (init) {
          await ctx.reply(init.caption, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: init.keyboard.reply_markup.inline_keyboard,
            },

          })
        }

      } else if (findSessionTelegram?.date !== this.date && findSessionTelegram !== null) {
        const session = new Session(id, findUserTelegram);

        findSessionTelegram ?
          await this.sessionService.delete(id) && await this.sessionService.createSession(session) :
          await this.sessionService.createSession(session)

        const init = await this.initializerService.initStartKeyboard(findSessionTelegram.statusUser)

        if (init) {
          await ctx.reply(init.caption, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: init.keyboard.reply_markup.inline_keyboard,
            },

          })
        }

      } else {
        const session = new Session(id, findUserTelegram);

        const newSession = await this.sessionService.createSession(session);

        const init = await this.initializerService.initStartKeyboard(newSession.statusUser)
        await this.userService.findByTelegramUserUpdateTelegramId(username, { telegramUserId: id, generateSymbol: 5000 })

        if (init) {
          await ctx.reply(init.caption, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: init.keyboard.reply_markup.inline_keyboard,
            },

          })
        }
      }


    } else {
      const user = await this.userService.create({ telegramUserId: id, telegramUser: username });

      const session = new Session(id, user)
      const sessionInDb = await this.sessionService.createSession(session);

      const init = await this.initializerService.initStartKeyboard(sessionInDb.statusUser);

      if (init) {
        await ctx.replyWithPhoto({ source: init.img }, {
          caption: init.caption,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: init.keyboard.reply_markup.inline_keyboard
          }
        });
      }

    }

  }



  @On('message')
  async getMessage(@Message('text') message: string, @Ctx() ctx: TelegrafContext) {
    const { id, username } = ctx.message.from

    const findSessionTelegram = await this.sessionService.findOne(id);

    if (findSessionTelegram?.state !== null && findSessionTelegram?.state === ActionState.REGISTER) {
      try {
        await this.validatorService.validateTypesString(message);
        await this.validatorService.validateEmail(message);

        const newRegister = await this.authService.register(message, id)

        if (newRegister) {
          const state = { statusUser: StatusUserBot.REGISTERED_BOT };

          await this.sessionService.updateOne(id, state)


          const init = await this.initializerService.initStartKeyboard(state.statusUser);

          if (init) {
            await this.statsService.stats({ success_registration: 1 })

            const stat = new SessionStats().getNewStatsSession({
              ...findSessionTelegram.stats,
              success_registration: 1
            })

            await this.sessionService.updateStats(id, stat)
            await this.sessionService.updateOne(id, { state: ActionState.REGISTER_SUCCESS })

            await ctx.replyWithPhoto({ source: init.img }, {
              caption: `${init.caption}\n\n<b>Ваша почта:</b>\n${newRegister.email}\n\n<b>Ваш пароль:</b>\n${newRegister.pass}`,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: init.keyboard.reply_markup.inline_keyboard
              }
            });
          }
        }

      } catch (e) {
        console.log(e)
        await ctx.reply(`<i>${e.message}</i>`, {
          parse_mode: 'HTML', reply_markup: {
            inline_keyboard: [
              [{ text: "📋 Вернутся в меню", callback_data: "start" }]
            ]
          }
        });
      }
    }

    if (findSessionTelegram?.state !== null && findSessionTelegram?.state === ActionState.LOGIN) {
      try {
        if (!findSessionTelegram.login.tickEmail) {
          await this.validatorService.validateTypesString(message);
          await this.validatorService.validateEmail(message);

          const setEmail = new LoginSession().updateLoginSessionDate({
            ...findSessionTelegram.login,
            email: message,
            tickEmail: true
          });

          await this.sessionService.updateLogin(id, setEmail);
          await ctx.reply('Ваш пароль 👇')
        }

        if (!findSessionTelegram.login.tickPassword && findSessionTelegram.login.tickEmail) {
          await this.validatorService.validateTypesString(message);
          const setPassword = new LoginSession().updateLoginSessionDate({
            ...findSessionTelegram.login,
            password: message,
            tickPassword: true,
            isLogin: true
          });
          await this.sessionService.updateLogin(id, setPassword);

          await this.authService.authLogin(username, {
            email: findSessionTelegram.login.email,
            password: message,
            telegramUserId: id
          })

          await this.sessionService.updateOne(id, {
            confirmed: true,
            statusUser: StatusUserBot.REGISTER_BOT_SITE
          })

          await this.statsService.stats({ authorization: 1 })

          const defaultSession = new LoginSession().createDataSetLogin();
          await this.sessionService.updateLogin(id, defaultSession);

          const init = await this.initializerService.initStartKeyboard(StatusUserBot.REGISTER_BOT_SITE);

          await ctx.reply(init.caption, init.keyboard)
        }

      } catch (e) {
        await ctx.reply(`<i>${e.message}</i>`, {
          parse_mode: 'HTML', reply_markup: {
            inline_keyboard: [
              [{ text: "📋 Вернутся в меню", callback_data: "start" }]
            ]
          }
        });
        const findSessionTelegram = await this.sessionService.findOne(id);

        if (findSessionTelegram.login.isLogin) {
          const defaultSession = new LoginSession().createDataSetLogin();
          await this.sessionService.updateLogin(id, defaultSession);

          const state = { state: ActionState.DEFAULT }
          await this.sessionService.updateOne(id, state)
        }
      }
    }

    if (findSessionTelegram?.state !== null && findSessionTelegram?.state === ActionState.AI_COPYWRITER) {
      try {
        await this.validatorService.validateTypesString(message);

        const defaultSession = new CopywritingService().createCopywritingSession();
        await this.sessionService.updateCopywriterData(id, defaultSession);


        if (!findSessionTelegram.copywriting_data.tickName) {
          const dataSetCopywriting = new CopywritingService().setCopywritingSession({
            ...findSessionTelegram.copywriting_data,
            name: message,
            tickName: true
          })

          await this.sessionService.updateOne(id, {
            copywriting_data: dataSetCopywriting

          })

          if (findSessionTelegram.stats.start_generation_button === 0) {
            const updateStats = new SessionStats().getNewStatsSession({
              ...findSessionTelegram.stats,
              start_generation_button: 1
            })

            await this.sessionService.updateStats(id, updateStats);

            await this.statsService.stats({ start_generation_button: 1 })
          } else {
            await this.statsService.updateStats({ regenerate_button: 1 })
          }


          await ctx.reply('<b>Введите описание товара</b>\n\n <i>например "\для детей и взрослых, демисезонная, черная\"</i>', {
            parse_mode: 'HTML',
          })

        }

        if (!findSessionTelegram.copywriting_data.tickDescription && findSessionTelegram.copywriting_data.tickName) {
          const dataSetCopywriting = new CopywritingService().setCopywritingSession({
            ...findSessionTelegram.copywriting_data,
            description: message,
            tickDescription: true,
          })

          await this.sessionService.updateOne(id, {
            copywriting_data: dataSetCopywriting
          })

          await ctx.reply('<b>Введите ключевые слова</b>\n\n<i>цвет - желтый, размер - s, m, l, xl, застежка - молния, стильная и яркая</i>', {
            parse_mode: 'HTML',
          })

        }

        if (
          findSessionTelegram.copywriting_data.tickDescription &&
          findSessionTelegram.copywriting_data.tickName &&
          !findSessionTelegram.copywriting_data.tickKeywords
        ) {
          const dataSetCopywriting = new CopywritingService().setCopywritingSession({
            ...findSessionTelegram.copywriting_data,
            keywords: message,
            tickKeywords: true,
          })

          await this.sessionService.updateOne(id, {
            copywriting_data: dataSetCopywriting
          })

          await ctx.reply('Генерация может занять некоторе время... 🤞🏽')
          const response = await this.initializerService.getAiDataBot(findSessionTelegram.copywriting_data, findSessionTelegram.userId);

          if (response) {
            await ctx.reply(response)

            const init = await this.initializerService.initKeyboard(ActionState.AI_COPYWRITER, id)
            await ctx.reply(init.message, init.keyboard);
          }

        }
      } catch (e) {

      }
    }
  }

  // @Cron(CronExpression.EVERY_11_HOURS, { timeZone: 'Europe/Moscow' })
  // async event() {
  //   const users = await this.userService.findAll();
  //   const link = path.join(__dirname, '../public/photo_2023-03-29_15-25-52.jpg')
  //   const sourceImg = fs.createReadStream(link)

  //   users.map(async (user) => {
  //     try {
  //       await this.bot.sendPhoto(user.telegramUserId, { source: sourceImg }, {
  //         caption: `+100к символов за регистрацию🚀\n\n<a href='https://my-copy.io/'>My copy</a> генерирует за 10 сек. Кто зарегистрируется в течение 24 ч, тому пополним счет на +100к символов🔥\n\nУже 15 виджетов: описания для ВБ, Ozon, Amazon, рерайт, копирайт статей, посты, кликбейт заголовки, сценарии TikTok, YouTube, отзывы, генератор ключевиков, составление плана, списка.\n\nРегистрируйтесь и присылайте свою почту:\n<b>https://t.me/JayPr0</b>`,
  //         parse_mode: 'HTML'
  //       });

  //     } catch (e) {
  //       console.log(e)
  //     }

  //   })
  // }



}
