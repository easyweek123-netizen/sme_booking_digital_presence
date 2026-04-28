import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ALLOWED_BUDGETS = [
  'under_5k',
  '5_15k',
  '15_50k',
  '50k_plus',
  'not_sure',
] as const;

export type Budget = (typeof ALLOWED_BUDGETS)[number];

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  company?: string;

  @IsString()
  @IsIn(ALLOWED_BUDGETS as unknown as string[])
  budget: Budget;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(5000)
  message: string;
}
