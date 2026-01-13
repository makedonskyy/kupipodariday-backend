import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { WishListsErrors } from './wishlists.constants';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = await this.wishesService.getManyByIds(itemsId);
    const wishlist = await this.wishlistRepository.save({
      items,
      owner: user,
      ...rest,
    });
    const fullWishlist = await this.wishlistRepository.findOne({
      where: { id: wishlist.id },
      relations: ['owner', 'items'],
    });

    return fullWishlist.toJSON();
  }

  async getWishLists() {
    const wishlists = await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });

    return wishlists.map((wishlist) => wishlist.toJSON());
  }

  async findById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(WishListsErrors.NotFound);
    }

    return wishlist.toJSON();
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException(WishListsErrors.NotFound);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(WishListsErrors.NotOwner);
    }

    const { itemsId = [], name, image, description } = updateWishlistDto;
    const wishes = await this.wishesService.getManyByIds(itemsId);

    await this.wishlistRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: wishes,
    });
    return await this.findById(id);
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner'],
    });

    if (!wishlist) {
      throw new NotFoundException(WishListsErrors.NotFound);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(WishListsErrors.NotOwner);
    }

    await this.wishlistRepository.delete(wishlistId);
    return wishlist.toJSON();
  }
}
