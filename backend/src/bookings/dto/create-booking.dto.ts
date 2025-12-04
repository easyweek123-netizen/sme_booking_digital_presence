import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD format

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string; // HH:mm format
}
