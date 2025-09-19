import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { Repository } from 'typeorm';
import { CreatePropertyFeatureDto } from './dto/createPropertyFeature.dto';

@Injectable()
export class PropertyFeatureService {
  constructor(
    @InjectRepository(PropertyFeature)
    private propertyFeatureRepo: Repository<PropertyFeature>,
  ) {}

  async create(dto: CreatePropertyFeatureDto) {
    return await this.propertyFeatureRepo.save(dto);
  }

  async findOne(id: number) {
    const feature = await this.propertyFeatureRepo.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!feature) throw new NotFoundException('Property feature not found');
    return feature;
  }

  //   async update(id: number, dto: UpdatePropertyFeatureDto) {
  //     const feature = await this.findOne(id);
  //     return await this.propertyFeatureRepo.save({ ...feature, ...dto });
  //   }

  async delete(id: number) {
    const result = await this.propertyFeatureRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property feature not found');
    }
    return { message: 'Property feature deleted successfully' };
  }
}
