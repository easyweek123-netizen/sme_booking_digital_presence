import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateOwnerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}
