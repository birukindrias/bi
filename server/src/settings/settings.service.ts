import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { copyDir } from 'src/utils/helpers';
import { Connection, Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Settings } from './entities/settings.entity';
import { CreateSignalChatDto } from './dto/create-signal-chat.dto';
import { randomUUID } from 'crypto';
import { UpdateSignalChatDto } from './dto/update-signal-chat.dto';
import {
  existsSync,
  mkdirSync,
  readdir,
  readFile,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { Game } from '../game/entities/game.entity';
import { readdirSync } from 'fs';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  constructor(
    @InjectRepository(Settings)
    private readonly settingRepository: Repository<Settings>,

    private connection: Connection,
  ) {}

  async create(): Promise<Settings> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let settings = this.settingRepository.create();

      //TODO: CREATE SIGNAL FOLDER IF NOT EXISTS AND COPY FILES
      // let signalSetting = this.signalSettingRepository.create();
      // signalSetting = await queryRunner.manager.save(signalSetting);
      // settings.signalSettings = signalSetting;
      settings = await queryRunner.manager.save(settings);

      const destPathImage = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settings.id,
        'images',
      );

      this.logger.debug('Destination Path Images', destPathImage);
      const srcPathImage = join(__dirname, '..', '..', 'default', 'images');
      this.logger.debug('Source Path Images', srcPathImage);
      const destPathText = join(__dirname, '..', '..', 'texts', settings.id);
      const srcPathText = join(__dirname, '..', '..', 'default', 'texts');

      const destPathJsons = join(__dirname, '..', '..', 'uploads', settings.id);
      const srcPathJsons = join(__dirname, '..', '..', 'default', 'jsons');

      await copyDir(srcPathImage, destPathImage);
      await copyDir(srcPathText, destPathText);
      await copyDir(srcPathJsons, destPathJsons);

      await queryRunner.commitTransaction();
      return settings;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Settings> {
    try {
      const settings = await this.settingRepository.findOne({ where: { id } });
      if (settings) {
        const updatedGame = await this.settingRepository.save({
          id,
          ...settings,
          ...updateSettingDto,
        });

        return updatedGame;
      }

      throw new HttpException(
        'No Settings with privoded id found',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createSignalChat(createSignalChatDto: CreateSignalChatDto) {
    try {
      //1. Create new Signal Chat Json in uploads/settingsId/signal/chats

      const chatId = randomUUID();

      //generate uuid
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        createSignalChatDto.settingsId,
        'signal',
        'chats',
      );
      const chatJson = {
        id: chatId,
        name: createSignalChatDto.name || 'Default Name',
        createdAt: new Date(),
        messages: [],
      };
      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }
      this.logger.debug('Destination Path', pathName);
      writeFileSync(join(pathName, chatId + '.json'), JSON.stringify(chatJson));
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteSignalChat(signalChatId: string, settingsId: string) {
    try {
      const dir = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsId,
        'signal',
        'chats',
      );

      readdir(dir, (err, files) => {
        files.forEach((file) => {
          console.log(file);
        });
      });
      console.log(dir);
      if (existsSync(dir)) {
        rmSync(join(dir, signalChatId + '.json'), {
          recursive: true,
          force: true,
        });
        return {
          id: signalChatId,
        };
      } else {
        throw new HttpException(
          'No Signal Chat with privoded id found',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateSignalChat(
    chatId: string,
    updateSignalChatDto: UpdateSignalChatDto,
  ) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        updateSignalChatDto.settingsID,
        'signal',
        'chats',
      );
      const pathAndFileName = join(pathName, chatId + '.json');
      //check if file exists
      if (!existsSync(pathAndFileName)) {
        throw new HttpException(
          'No Signal Chat with privoded id found',
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log('File to update found');
      const signalChat = updateSignalChatDto.chat;
      this.logger.log('Messages are being updated');
      writeFileSync(pathAndFileName, JSON.stringify(signalChat), {
        encoding: 'utf8',
        flag: 'w',
      });
      this.logger.debug('Destination Path', pathAndFileName);
      return signalChat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSignalChat(chatId: string, settingsId: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsId,
        'signal',
        'chats',
      );
      const pathAndFileName = join(pathName, chatId + '.json');
      //check if file exists
      if (!existsSync(pathAndFileName)) {
        throw new HttpException(
          'No Signal Chat with privoded id found',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log('File to update found');
      //read file
      const signalChat = JSON.parse(readFileSync(pathAndFileName, 'utf8'));

      return signalChat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async getSignalChatMessages(signalChatId: string, settingsId: string) {
  //   try {
  //     const signalChat = await this.signalChatRepository.findOne({
  //       where: { id: signalChatId },
  //     });

  //     if (!signalChat) {
  //       throw new HttpException(
  //         'No Signal Chat with privoded id found',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     const pathName = join(
  //       __dirname,
  //       '..',
  //       '..',
  //       'uploads',
  //       settingsId,
  //       'chats',
  //     );

  //     const fileName = pathName + `/${signalChat.id}.json`;
  //     if (!existsSync(fileName)) {
  //       return [];
  //     }
  //     const messages = JSON.parse(readFileSync(fileName).toString());
  //     return messages;
  //   } catch (error) {
  //     throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getSignalChats(settingsId: string) {
    try {
      const chats: any = [];
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsId,
        'signal',
        'chats',
      );

      const files = readdirSync(pathName);

      files.forEach((file) => {
        if (file.includes('json') && existsSync(join(pathName, file))) {
          const chat = JSON.parse(
            readFileSync(join(pathName, file)).toString(),
          );
          chats.push(chat);
        }
      });
      return chats;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async saveEmailJson(settingsID: string, body: any) {
    try {
      const json = JSON.stringify(body);
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'emails',
      );

      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }

      this.logger.debug('Destination Path', pathName);
      writeFileSync(pathName + `/email.json`, json);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEmailJson(settingsID: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'emails',
      );

      const fileName = pathName + `/email.json`;
      if (!existsSync(fileName)) {
        return [];
      }
      const messages = JSON.parse(readFileSync(fileName).toString());
      return messages;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getEmailSsr(game: Game) {
    return this.getEmailJson(game.setting.id);
  }

  async saveHiveJson(settingsID: string, body: any) {
    try {
      const json = JSON.stringify(body);
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'hive',
      );

      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }

      this.logger.debug('Destination Path', pathName);
      writeFileSync(pathName + `/chat.json`, json);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHiveJson(settingsID: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'hive',
      );

      const fileName = pathName + `/chat.json`;
      if (!existsSync(fileName)) {
        return [];
      }
      const messages = JSON.parse(readFileSync(fileName).toString());
      return messages;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHiveSsr(game: Game) {
    return this.getHiveJson(game.setting.id);
  }

  async saveMilkroadJson(settingsID: string, body: any) {
    try {
      const json = JSON.stringify(body);
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'milkroad',
      );

      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }

      this.logger.debug('Destination Path', pathName);
      writeFileSync(pathName + `/chat.json`, json);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMilkroadJson(settingsID: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'milkroad',
      );

      const fileName = pathName + `/chat.json`;
      if (!existsSync(fileName)) {
        return [];
      }
      const messages = JSON.parse(readFileSync(fileName).toString());
      return messages;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMilkroadSsr(game: Game) {
    return this.getMilkroadJson(game.setting.id);
  }

  async saveDepartmentJson(settingsID: string, body: any) {
    try {
      const json = JSON.stringify(body);
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'departments',
      );

      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }

      this.logger.debug('Destination Path', pathName);
      writeFileSync(pathName + `/departments.json`, json);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDepartmentJson(settingsID: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'departments',
      );

      const fileName = pathName + `/departments.json`;
      if (!existsSync(fileName)) {
        return [];
      }
      const messages = JSON.parse(readFileSync(fileName).toString());
      return messages;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDepartmentSsr(game: Game) {
    return this.getDepartmentJson(game.setting.id);
  }

  async saveTwitterJson(settingsID: string, body: any) {
    try {
      const json = JSON.stringify(body);
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'twitter',
      );

      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }

      this.logger.debug('Destination Path', pathName);
      writeFileSync(pathName + `/twitter.json`, json);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTwitterJson(settingsID: string) {
    try {
      const pathName = join(
        __dirname,
        '..',
        '..',
        'uploads',
        settingsID,
        'twitter',
      );

      const fileName = pathName + `/twitter.json`;
      if (!existsSync(fileName)) {
        return [];
      }
      const messages = JSON.parse(readFileSync(fileName).toString());
      return messages;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getTwitterSsr(game: Game) {
    return this.getTwitterJson(game.setting.id);
  }
}
