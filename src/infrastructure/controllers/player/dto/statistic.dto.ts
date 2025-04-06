import { ApiProperty } from '@nestjs/swagger';
import { StatisticEntity } from 'core/repositories';

export class StaticticDto implements StatisticEntity {
  @ApiProperty()
  medianPlayerHeight: number;
  @ApiProperty()
  countryWithMostWinRatio: string;
  @ApiProperty()
  meanBodyMassIndex: number;
}
