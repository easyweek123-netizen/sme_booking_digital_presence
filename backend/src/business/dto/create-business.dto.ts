import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  Min,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DaySchedule,
  WorkingHours,
} from '../../common/types';

export class DayScheduleDto implements DaySchedule {
  @IsBoolean()
  isOpen: boolean;

  @IsString()
  @IsNotEmpty()
  openTime: string;

  @IsString()
  @IsNotEmpty()
  closeTime: string;
}

export class WorkingHoursDto implements WorkingHours {
  @ValidateNested()
  @Type(() => DayScheduleDto)
  monday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  tuesday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  wednesday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  thursday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  friday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  saturday: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  sunday: DayScheduleDto;
}

export class ServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

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

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

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

  @IsObject()
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours: WorkingHoursDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];
}
