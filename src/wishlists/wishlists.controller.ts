import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { ValidationFilter } from '../common/filters/validation.filter';
import { GetUser, GetUserId } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlists')
@UseInterceptors(PasswordInterceptor)
@UseGuards(AuthGuardJwt)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getWishlists() {
    return this.wishlistsService.getWishLists();
  }

  @Post()
  @UseFilters(ValidationFilter)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @GetUser() user: User,
  ) {
    return await this.wishlistsService.create(createWishlistDto, user);
  }

  @Get(':id')
  getWishlist(@Param('id') id: number) {
    return this.wishlistsService.findById(id);
  }

  @Patch(':id')
  @UseFilters(ValidationFilter)
  update(
    @Param('id') wishId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @GetUserId() userId: number,
  ) {
    return this.wishlistsService.update(wishId, updateWishlistDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') wishId: number, @GetUserId() userId: number) {
    return this.wishlistsService.remove(wishId, userId);
  }
}
