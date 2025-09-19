import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(PropertyFeature)
    private propertyFeatureRepo: Repository<PropertyFeature>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findOne(id: number) {
    const property = await this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyFeature', 'propertyFeature')
      .leftJoinAndSelect('property.user', 'user')
      .where('property.id = :id', { id })
      .getOne();

    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async findAll(paginationDTO: PaginationDTO) {
    const pageNumber = paginationDTO.pageNumber ?? 1;
    const pageSize = paginationDTO.pageSize ?? DEFAULT_PAGE_SIZE;
    const skip = (pageNumber - 1) * pageSize;

    const [properties, total] = await this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyFeature', 'propertyFeature')
      .leftJoinAndSelect('property.user', 'user')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: properties,
      pagination: {
        page: pageNumber,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: pageNumber < Math.ceil(total / pageSize),
        hasPrev: pageNumber > 1,
      },
    };
  }

  async create(dto: CreatePropertyDto) {
    console.log('Creating property with data:', dto);

    // First, find the user to ensure they exist
    const user = await this.userRepo.findOne({ where: { id: dto.ownerId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.ownerId} not found`);
    }

    return await this.propertyRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // Create property with user relation
        const property = transactionalEntityManager.create(Property, {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          ownerId: dto.ownerId,
          user: user,
        });

        const savedProperty = await transactionalEntityManager.save(property);
        console.log('Saved property:', savedProperty);

        // Create property feature
        if (dto.propertyFeature) {
          const propertyFeature = transactionalEntityManager.create(
            PropertyFeature,
            {
              ...dto.propertyFeature,
              property: savedProperty,
            },
          );

          const savedFeature =
            await transactionalEntityManager.save(propertyFeature);
          console.log('Saved property feature:', savedFeature);
        }

        // Return the complete property with relations
        return await transactionalEntityManager.findOne(Property, {
          where: { id: savedProperty.id },
          relations: ['propertyFeature', 'user'],
        });
      },
    );
  }

  async update(id: number, dto: UpdatePropertyDto) {
    const property = await this.findOne(id);

    // Update basic property info
    if (dto.name !== undefined) property.name = dto.name;
    if (dto.description !== undefined) property.description = dto.description;
    if (dto.price !== undefined) property.price = dto.price;

    // Update owner if provided
    if (dto.ownerId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: dto.ownerId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.ownerId} not found`);
      }
      property.ownerId = dto.ownerId;
      property.user = user;
    }

    const updatedProperty = await this.propertyRepo.save(property);

    // Update property feature if provided
    if (dto.propertyFeature && property.propertyFeature) {
      const feature = await this.propertyFeatureRepo.findOne({
        where: { id: property.propertyFeature.id },
      });

      if (feature) {
        Object.assign(feature, dto.propertyFeature);
        await this.propertyFeatureRepo.save(feature);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number) {
    const result = await this.propertyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property not found');
    }
    return { message: 'Property deleted successfully' };
  }

  // Optional: Get properties by user ID
  async findByUserId(userId: number) {
    return await this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyFeature', 'propertyFeature')
      .leftJoinAndSelect('property.user', 'user')
      .where('property.ownerId = :userId', { userId })
      .getMany();
  }
}
