import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ParseIdPipe } from 'src/property/pipes/parseIdpipe';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreatePropertyDto } from 'src/property/dto/createProperty.dto';
import { LikePropertyDto } from './dto/likeProperty.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard) // Apply JWT guard to all endpoints
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIdPipe) id, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Post(':id/properties')
  createProperty(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.userService.createPropertyForUser(userId, createPropertyDto);
  }

  @Get(':id/properties')
  getUserProperties(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserProperties(userId);
  }

  @Post(':id/like')
  likeProperty(
    @Param('id', ParseIntPipe) userId: number,
    @Body() likePropertyDto: LikePropertyDto,
  ) {
    return this.userService.likeProperty(userId, likePropertyDto.propertyId);
  }

  @Post(':id/unlike')
  unlikeProperty(
    @Param('id', ParseIntPipe) userId: number,
    @Body() likePropertyDto: LikePropertyDto,
  ) {
    return this.userService.unlikeProperty(userId, likePropertyDto.propertyId);
  }

  @Get(':id/liked-properties')
  getLikedProperties(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getLikedProperties(userId);
  }

  // Admin-only delete endpoint
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
