import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  existsSync,
  createReadStream,
  readdirSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { GameService } from 'src/game/game.service';
import { Settings } from './entities/settings.entity';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateSignalChatDto } from './dto/create-signal-chat.dto';
import { UpdateSignalChatDto } from './dto/update-signal-chat.dto';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);
  constructor(
    private readonly settingsService: SettingsService,
    private readonly gameService: GameService,
  ) {}

  @Get('images/:id/:name')
  getFile(
    @Res() res: Response,
    @Param('id') settingsId: string,
    @Param('name') fileName: string,
  ) {
    const pathName = join(
      __dirname,

      '..',
      '..',
      'uploads',
      settingsId,
      'images',
      fileName,
    );

    if (!existsSync(pathName)) {
      throw new HttpException('FILE NOT FOUND', HttpStatus.NOT_FOUND);
    }
    const file = createReadStream(pathName);
    //return new StreamableFile(file);

    file.pipe(res);
  }

  @Get('images/:id')
  async getAllFileNames(@Param('id') settingsId: string): Promise<string[]> {
    const files: string[] = [];

    const pathName = join(
      __dirname,

      '..',
      '..',
      'uploads',
      settingsId,
      'images',
    );
    const entries = readdirSync(pathName, { withFileTypes: true });

    for (const entry of entries) {
      files.push(entry.name);
    }

    return files;
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateSettingDto,
  ): Promise<Settings> {
    return this.settingsService.update(id, updateSettingsDto);
  }

  @Post('language/:id')
  async saveLanguageFile(@Param('id') settingsId: string, @Body() body: any) {
    const json = JSON.stringify(body);

    const pathName = join(__dirname, '..', '..', 'texts', settingsId);

    if (!existsSync(pathName)) {
      mkdirSync(pathName, { recursive: true });
    }
    writeFileSync(pathName + '/text.json', json);

    return json;
  }

  @Get('language/:gameId')
  async getLanguageFile(@Param('gameId') gameId: string): Promise<any> {
    try {
      const game = await this.gameService.getGameById(gameId);

      if (!game) {
        throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const pathName = join(
        __dirname,

        '..',
        '..',
        'texts',
        game.setting.id,
        'text.json',
      );
      if (!existsSync(pathName)) {
        throw new HttpException('FILE NOT FOUND', HttpStatus.NOT_FOUND);
      }

      const rawData = readFileSync(pathName);

      return JSON.parse(rawData as unknown as string);
    } catch (error) {
      throw error;
    }
  }

  @Post('fileupload/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const settingsId = req.params.id;

          const pathName = join(
            __dirname,

            '..',
            '..',
            'uploads',
            settingsId,
            'images',
          );

          if (!existsSync(pathName)) {
            mkdirSync(pathName, { recursive: true });
          }
          cb(null, pathName);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') settingsId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log(`Successfully updated ${file.originalname}`);
  }

  @Post('signal/chat')
  async createSignalSettings(@Body() createSignalChatDto: CreateSignalChatDto) {
    return this.settingsService.createSignalChat(createSignalChatDto);
  }

  @Delete('signal/chat/:id/:settingsId')
  async deleteSignalSettings(
    @Param('id') id: string,
    @Param('settingsId') settingsId: string,
  ) {
    return this.settingsService.deleteSignalChat(id, settingsId);
  }

  //update chat
  @Patch('signal/chat/:id')
  async updateSignalSettings(
    @Param('id') chatId: string,
    @Body() updateSignalChatDto: UpdateSignalChatDto,
  ) {
    return this.settingsService.updateSignalChat(chatId, updateSignalChatDto);
  }

  @Get('signal/chat/:id/:settingsId')
  async getSignalSettings(
    @Param('id') chatId: string,
    @Param('settingsId') settingsId: string,
  ) {
    return this.settingsService.getSignalChat(chatId, settingsId);
  }

  // @Get('signal/messages/:id/:settingsId')
  // async getSignalMessages(
  //   @Param('id') chatId: string,
  //   @Param('settingsId') settingsId: string,
  // ) {
  //   return this.settingsService.getSignalChatMessages(chatId, settingsId);
  // }

  @Get('signal/chats/:settingsId')
  async getSignalChats(@Param('settingsId') settingsId: string) {
    // const game = await this.gameService.getGameById(gameId);
    // if (!game) {
    //   throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    // }
    return this.settingsService.getSignalChats(settingsId);
  }

  @Get('signal/chats/ssr/:gameId')
  async getSignalChatsSsr(@Param('gameId') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getSignalChats(game.setting.id);
  }

  @Post('email/:id')
  async createEmailSettings(
    @Param('id') settingsId: string,
    @Body() body: any,
  ) {
    return this.settingsService.saveEmailJson(settingsId, body);
  }

  @Get('email/:id')
  async getEmails(@Param('id') settingsId: string) {
    return this.settingsService.getEmailJson(settingsId);
  }

  @Get('email/ssr/:id')
  async getEmailSsr(@Param('id') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getEmailSsr(game);
  }

  @Post('hive/:id')
  async createHiveChat(@Param('id') settingsId: string, @Body() body: any) {
    return this.settingsService.saveHiveJson(settingsId, body);
  }

  @Get('hive/:id')
  async getHiveChat(@Param('id') settingsId: string) {
    return this.settingsService.getHiveJson(settingsId);
  }

  @Get('hive/ssr/:id')
  async getHiveSsr(@Param('id') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getHiveSsr(game);
  }

  @Post('milkroad/:id')
  async createMilkRoadChat(@Param('id') settingsId: string, @Body() body: any) {
    return this.settingsService.saveMilkroadJson(settingsId, body);
  }

  @Get('milkroad/:id')
  async getMilkRoadChat(@Param('id') settingsId: string) {
    return this.settingsService.getMilkroadJson(settingsId);
  }

  @Get('milkroad/ssr/:id')
  async getMilkRoadSsr(@Param('id') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getMilkroadSsr(game);
  }

  @Post('departments/:id')
  async createDepartments(@Param('id') settingsId: string, @Body() body: any) {
    return this.settingsService.saveDepartmentJson(settingsId, body);
  }

  @Get('departments/:id')
  async getDepartments(@Param('id') settingsId: string) {
    return this.settingsService.getDepartmentJson(settingsId);
  }

  @Get('departments/ssr/:id')
  async getDepartmentsSsr(@Param('id') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getDepartmentSsr(game);
  }

  @Post('twitter/:id')
  async createTwitterSettings(
    @Param('id') settingsId: string,
    @Body() body: any,
  ) {
    return this.settingsService.saveTwitterJson(settingsId, body);
  }

  @Get('twitter/:id')
  async getTwitter(@Param('id') settingsId: string) {
    return this.settingsService.getTwitterJson(settingsId);
  }

  @Get('twitter/ssr/:id')
  async getTwitterSsr(@Param('id') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      throw new HttpException('GAME NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.settingsService.getTwitterSsr(game);
  }
}
