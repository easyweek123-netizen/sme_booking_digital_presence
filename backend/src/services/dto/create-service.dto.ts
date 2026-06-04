import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsPositive,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number | null;

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDays?: string[] | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsInt()
  @IsPositive()
  locationId: number;
}
