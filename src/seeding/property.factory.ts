import { setSeederFactory } from 'typeorm-extension';
import { Property } from '../entities/property.entity';
import { Faker } from '@faker-js/faker';

export const PropertyFactory = setSeederFactory(Property, (faker: Faker) => {
  const propery = new Property();
  propery.name = faker.location.street();
  propery.price = +faker.commerce.price({ min: 10000, max: 100000 });
  propery.description = faker.lorem.sentence();
  //   propery.avatarUrl = faker.image.avatar();

  return propery;
});
