import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParseIdPipe } from './pipes/parseIdpipe';
import { ZodValidationPipe } from './pipes/zodValidationPipe';
import * as createPropertyZodDto from './dto/createPropertyZod.dto';
import { RequestHeader } from './pipes/request-header';
import { HeadersDto } from './dto/headers.dto';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { PropertyService } from './property.service';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { PaginationDTO } from './dto/pagination.dto';

@Controller('property')
export class PropertyController {
  // propertyService: PropertyService;
  constructor(private propertyService: PropertyService) {
    // Don't create your dependency, instead use dependency injections
    // this.propertyService = new PropertyService();
    // this.propertyService = propertyService;
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.propertyService.findAll(paginationDTO);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id) {
    return this.propertyService.findOne(id);
  }

  @Post()
  //   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  //   @HttpCode(202)
  // @UsePipes(new ZodValidationPipe(createPropertyZodDto.createPropertySchema))
  create(
    @Body()
    dto: CreatePropertyDto,
  ) {
    return this.propertyService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id,
    @Body()
    body: UpdatePropertyDto,
    // @RequestHeader(HeadersDto) header: HeadersDto,
  ) {
    return this.propertyService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIdPipe) id) {
    return this.propertyService.delete(id);
  }
}
