import { IsEmail, IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @IsString()
  @IsOptional()
  source?: string;
}

