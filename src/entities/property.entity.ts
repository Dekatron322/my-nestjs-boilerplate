import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

import { PropertyFeature } from './propertyFeature.entity';
import { PropertyType } from './propertyType.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  ownerId: number;

  @OneToOne(
    () => PropertyFeature,
    (propertyFeature) => propertyFeature.property,
    {
      eager: true,
    },
  )
  propertyFeature: PropertyFeature;

  @ManyToOne(() => User, (user) => user.property)
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @ManyToMany(() => User, (user) => user.likedProperties)
  likedBy: User[];

  @ManyToOne(() => PropertyType)
  type: PropertyType;
}
