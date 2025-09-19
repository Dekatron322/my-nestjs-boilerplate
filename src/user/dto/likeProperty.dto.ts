import { IsInt } from 'class-validator';

export class LikePropertyDto {
  @IsInt()
  propertyId: number;
}
