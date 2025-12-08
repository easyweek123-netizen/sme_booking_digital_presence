import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  firebaseUid: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
