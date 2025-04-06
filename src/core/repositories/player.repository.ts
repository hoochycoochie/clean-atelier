import { PlayerEntity } from 'core/entities/player.domain';

export interface StatisticEntity {
  countryWithMostWinRatio: string;
  meanBodyMassIndex: number;
  medianPlayerHeight: number;
}

export type Pagination<T> = {
  data: T[];
};
export type PaginationParams = {
  limit?: number;
};
export interface IPlayerRepository {
  find(arg: PaginationParams): Promise<PlayerEntity[]>;
  findOne(id: any): Promise<PlayerEntity>;
  statistics(): Promise<StatisticEntity>;
}
