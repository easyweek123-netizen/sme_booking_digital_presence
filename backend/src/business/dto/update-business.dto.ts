import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHoursDto } from './create-business.dto';

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  instagram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Brand color must be a valid hex color (e.g., #FF5733)' })
  brandColor?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto;
}
