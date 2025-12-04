import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsNumber()
  @IsPositive()
  businessId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  @Min(15)
  durationMinutes: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDays?: string[] | null;
}
