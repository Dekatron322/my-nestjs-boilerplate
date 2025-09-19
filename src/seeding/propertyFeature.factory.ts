import { setSeederFactory } from 'typeorm-extension';
import { Property } from '../entities/property.entity';
import { PropertyFeature } from 'src/entities/propertyFeature.entity';

export const PropertyFeatureFactory = setSeederFactory(
  PropertyFeature,
  (fakerInstance) => {
    const feature = new PropertyFeature();
    feature.area = fakerInstance.number.int({ min: 25, max: 2500 });
    feature.bathrooms = fakerInstance.number.int({ min: 1, max: 10 });
    feature.bedrooms = fakerInstance.number.int({ min: 1, max: 10 });
    feature.parkingSpots = fakerInstance.number.int({ min: 1, max: 10 });
    feature.hasBalcony = fakerInstance.datatype.boolean();
    feature.hasGardenYard = fakerInstance.datatype.boolean();
    feature.hasSwimmingPool = fakerInstance.datatype.boolean();

    return feature;
  },
);
