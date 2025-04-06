import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerEntity } from 'core/entities/player.domain';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import mongoose, { Model } from 'mongoose';
import { players } from '../../const';
import { PlayerUtils } from '../../utils';
import { Player } from '../schemas';

@Injectable()
export class PlayerMongodbRepositoryService implements IPlayerRepository {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  async find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = await this.playerModel
        .find()
        .limit(limit || 10)
        .sort('data.rank');
      return Promise.resolve(players);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number | string): Promise<PlayerEntity> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      if (!mongoose.isValidObjectId(objectId))
        throw new BadRequestException(`id =${objectId} is invalid`);
      const player = await this.playerModel.findById(objectId);
      if (!player)
        throw new NotFoundException(
          `player with id = ${objectId} is not found`,
        );

      return Promise.resolve(player);
    } catch (error) {
      throw error;
    }
  }

  async statistics(): Promise<StatisticEntity> {
    try {
      const players = await this.playerModel.find();
      const stats: StatisticEntity = {
        countryWithMostWinRatio: '',
        meanBodyMassIndex: 0,
        medianPlayerHeight: 0,
      };

      const [medianPlayerHeight, meanBodyMassIndex, countryWithMostWinRatio] =
        await Promise.all([
          PlayerUtils.computeMedianPlayersHeight(
            players.map((p) => p.data.height),
          ),
          PlayerUtils.computeMeanBodyMassIndex(players),
          PlayerUtils.computeMostWinRatioByCountry(players),
        ]);
      stats.medianPlayerHeight = medianPlayerHeight;
      stats.meanBodyMassIndex = meanBodyMassIndex;
      stats.countryWithMostWinRatio = countryWithMostWinRatio;

      return Promise.resolve(stats);
    } catch (error) {
      throw error;
    }
  }

  async onApplicationBootstrap() {
    await this.playerModel.deleteMany();

    await this.playerModel.insertMany(players);
  }
}
