import { PlayerEntity } from 'core/entities/player.domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* The Player class represents a player entity with properties such as id, firstname, lastname,
shortname, sex, country, picture, and data. */
@Entity()
export class Player implements PlayerEntity {
  @PrimaryGeneratedColumn()
  id: string | number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  shortname: string;
  sex: 'M' | 'F';
  @Column({ type: 'json' })
  country: { picture: string; code: string };
  @Column()
  picture: string;

  @Column({ type: 'json' })
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number;
    last: number[];
  };
}
