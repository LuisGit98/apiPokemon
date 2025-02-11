import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  @IsPositive()
  limit?: number;

  @Min(1)
  @IsPositive()
  @IsOptional()
  offset?: number;
}
