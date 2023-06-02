import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

//IMPORTANT: DON'T WRITE TO THE DATABASE DIRECTLY FROM THE SERVICE BUT RATHER FROM HUNTED SERVER
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getCompanyByCompanyId(companyId: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      return company;
    } catch (error) {
      throw new HttpException(
        'Error while getting company',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
