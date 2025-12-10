import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceCategoryDto {
  @IsNumber()
  @IsPositive()
  businessId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;
}

