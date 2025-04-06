export interface PlayerEntity {
  id?: any;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: 'M' | 'F';
  country: { picture: string; code: string };
  picture: string;
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number;
    last: number[];
  };
}

export type PlayerEntityWithRatioWin = Pick<
  PlayerEntity,
  'country' | 'data' | 'id'
> & { ratioWin?: number };
