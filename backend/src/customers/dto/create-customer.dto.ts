import { IsString, IsOptional, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  firebaseUid: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
