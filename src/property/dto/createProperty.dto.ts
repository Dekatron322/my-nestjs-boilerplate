import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { CreatePropertyFeatureDto } from './createPropertyFeature.dto';

export class CreatePropertyDto {
  @IsString({ always: true })
  name: string;

  @IsString()
  description: string;

  @IsInt({ always: true })
  @IsPositive()
  price: number;

  @IsInt()
  ownerId: number;

  @ValidateNested()
  @Type(() => CreatePropertyFeatureDto)
  propertyFeature: CreatePropertyFeatureDto;
}
