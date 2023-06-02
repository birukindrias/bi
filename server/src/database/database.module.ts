import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig = require('../typeormconfig');

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig)],
})
export class DatabaseModule {}
