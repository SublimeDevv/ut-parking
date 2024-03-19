import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators/index';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('get-all-users')
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.authService.getAllUsers(paginationDto);
  }

  @Get('find-user/:id')
  findUser(@Param('id') id: string) {
    return this.authService.findUser(id);
  }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch('update/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
