import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Brand color must be a valid hex color (e.g., #FF5733)',
  })
  brandColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImageUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  aboutContent?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z]+\/[A-Za-z_+\-/]+$|^UTC$/, {
    message: 'Timezone must be a valid IANA identifier (e.g., Europe/Vienna)',
  })
  timezone?: string;
}
