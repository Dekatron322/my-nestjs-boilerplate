import { IsBoolean, IsInt, IsPositive } from 'class-validator';

export class CreatePropertyFeatureDto {
  @IsInt()
  @IsPositive()
  bedrooms: number;

  @IsInt()
  @IsPositive()
  bathrooms: number;

  @IsInt()
  @IsPositive()
  parkingSpots: number;

  @IsInt()
  @IsPositive()
  area: number;

  @IsBoolean()
  hasBalcony: boolean;

  @IsBoolean()
  hasGardenYard: boolean;

  @IsBoolean()
  hasSwimmingPool: boolean;
}

export class UpdatePropertyFeatureDto extends CreatePropertyFeatureDto {}
