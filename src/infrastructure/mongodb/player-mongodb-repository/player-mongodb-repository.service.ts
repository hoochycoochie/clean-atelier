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

/* The PlayerMongodbRepositoryService class in TypeScript implements methods for finding player data,
retrieving player statistics, and handling application bootstrap tasks. */
@Injectable()
export class PlayerMongodbRepositoryService implements IPlayerRepository {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  /**
   * This TypeScript function asynchronously retrieves a specified number of player entities from a
   * database collection, with a default limit of 10 and sorting based on the 'rank' field.
   * @param {PaginationParams}  - It looks like the `find` method is a function that retrieves a list of
   * players with optional pagination parameters. The `limit` parameter specifies the maximum number of
   * players to return in the result set.
   * @returns An array of PlayerEntity objects is being returned.
   */
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

  /**
   * The function `findOne` retrieves a player entity by its ID, handling validation and error cases.
   * @param {number | string} id - The `id` parameter in the `findOne` function can be either a number
   * or a string. It is used to search for a player entity in the database based on the provided
   * identifier.
   * @returns The `findOne` method returns a Promise that resolves to a `PlayerEntity` object
   * representing a player with the specified `id`. If the player is found in the database, the method
   * resolves with the player object. If the player is not found, a `NotFoundException` is thrown with a
   * message indicating that the player with the specified `id` is not found. If the `id` provided is
   */
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

  /**
   * The function "statistics" retrieves player data, computes statistics such as median player height,
   * mean body mass index, and country with the most win ratio, and returns a promise with the
   * statistics.
   * @returns The `statistics()` function returns a Promise that resolves to a `StatisticEntity` object
   * containing the following properties:
   * - `countryWithMostWinRatio`: a string representing the country with the most win ratio.
   * - `meanBodyMassIndex`: a number representing the mean body mass index.
   * - `medianPlayerHeight`: a number representing the median player height.
   */
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

  /**
   * The `onApplicationBootstrap` function deletes all existing player data and inserts new player data
   * into the database.
   */
  async onApplicationBootstrap() {
    await this.playerModel.deleteMany();

    await this.playerModel.insertMany(players);
  }
}
