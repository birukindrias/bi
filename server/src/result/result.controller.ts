import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('result')
export class ResultController {
  private readonly logger = new Logger(ResultController.name);

  constructor(private readonly resultService: ResultService) {}
  @Get('/game/:id')
  getAllResultsForGame(@Param('id') id: string) {
    // return this.resultService.getAllForGame(id);
    return 'asdf';
  }
}
