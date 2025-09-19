import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Property } from 'src/entities/property.entity';
import { CreatePropertyDto } from 'src/property/dto/createProperty.dto';
import { PropertyFeature } from 'src/entities/propertyFeature.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(PropertyFeature)
    private propertyFeatureRepo: Repository<PropertyFeature>,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'property',
        'likedProperties',
        'likedProperties.propertyFeature',
      ],
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findAll() {
    return await this.userRepo.find({
      relations: [
        'property',
        'likedProperties',
        'likedProperties.propertyFeature',
      ],
    });
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return await this.userRepo.delete({ id });
  }

  async createPropertyForUser(
    userId: number,
    createPropertyDto: CreatePropertyDto,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.propertyRepo.manager.transaction(
      async (transactionalEntityManager) => {
        const property = transactionalEntityManager.create(Property, {
          name: createPropertyDto.name,
          description: createPropertyDto.description,
          price: createPropertyDto.price,
          ownerId: userId,
          user: user,
        });

        const savedProperty = await transactionalEntityManager.save(property);

        if (createPropertyDto.propertyFeature) {
          const propertyFeature = transactionalEntityManager.create(
            PropertyFeature,
            {
              ...createPropertyDto.propertyFeature,
              property: savedProperty,
            },
          );

          await transactionalEntityManager.save(propertyFeature);
        }

        return await transactionalEntityManager.findOne(Property, {
          where: { id: savedProperty.id },
          relations: ['propertyFeature', 'user'],
        });
      },
    );
  }

  async getUserProperties(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['property', 'property.propertyFeature'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.property;
  }

  // NEW: Like a property
  async likeProperty(userId: number, propertyId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['likedProperties'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const property = await this.propertyRepo.findOne({
      where: { id: propertyId },
      relations: ['propertyFeature'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Check if user already liked this property
    const alreadyLiked = user.likedProperties?.some((p) => p.id === propertyId);
    if (alreadyLiked) {
      throw new ConflictException('User already liked this property');
    }

    // Initialize likedProperties array if it doesn't exist
    if (!user.likedProperties) {
      user.likedProperties = [];
    }

    // Add property to liked properties
    user.likedProperties.push(property);
    await this.userRepo.save(user);

    return { message: 'Property liked successfully' };
  }

  // NEW: Unlike a property
  async unlikeProperty(userId: number, propertyId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['likedProperties'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.likedProperties || user.likedProperties.length === 0) {
      throw new NotFoundException('User has no liked properties');
    }

    // Remove property from liked properties
    user.likedProperties = user.likedProperties.filter(
      (p) => p.id !== propertyId,
    );
    await this.userRepo.save(user);

    return { message: 'Property unliked successfully' };
  }

  // NEW: Get user's liked properties
  async getLikedProperties(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['likedProperties', 'likedProperties.propertyFeature'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.likedProperties || [];
  }
}
