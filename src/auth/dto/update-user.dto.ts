import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles.interface';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsEmail()
  @IsOptional()
  @MinLength(6)
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  fullName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have an Uppercase, lowercase letter, and a number',
  })
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  tuition?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(150)
  picture?: string;

  @ApiProperty({ required: false, enum: ValidRoles })
  @IsEnum(ValidRoles)
  @IsOptional()
  roles?: ValidRoles;
}
