import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(AuthGuardJwt)
@UseInterceptors(PasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getOwn(@GetUserId() id: number) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @UseFilters(ValidationFilter)
  updateCurrentUser(
    @GetUserId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  getOwnWishes(@GetUserId() id: number) {
    return this.usersService.getOwnWishes(id);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @Post('find')
  findUsers(@Body() dto: FindUserDto) {
    return this.usersService.findMany(dto);
  }
}
