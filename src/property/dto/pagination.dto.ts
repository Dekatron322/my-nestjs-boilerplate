import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  pageNumber: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pageSize: number;
}
