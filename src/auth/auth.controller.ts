import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuardLocal } from '../common/guards/auth-guard-local.service';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(AuthGuardLocal)
  @Post('signin')
  signIn(@GetUserId() userId: number) {
    return this.authService.signIn(userId);
  }

  @Post('signup')
  @UseFilters(ValidationFilter)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
