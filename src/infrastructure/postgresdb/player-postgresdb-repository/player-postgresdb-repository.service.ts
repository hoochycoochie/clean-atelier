import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerEntity } from 'core/entities/player.domain';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { Repository } from 'typeorm';
import { players } from '../../const';
import { PlayerUtils } from '../../utils';
import { Player } from '../entities/player.entity';

/* The PlayerPostgresdbRepositoryService class implements methods to interact with a Player entity in a
PostgreSQL database, including finding players, retrieving player statistics, and handling
application bootstrap tasks. */
@Injectable()
export class PlayerPostgresdbRepositoryService implements IPlayerRepository {
  constructor(
    @InjectRepository(Player)
    private playerModel: Repository<Player>,
  ) {}

  /**
   * This TypeScript function asynchronously finds and returns a specified number of player entities
   * sorted by rank.
   * @param {PaginationParams}  - The `find` method is an asynchronous function that takes a `limit`
   * parameter from an object of type `PaginationParams`. It queries the database using the `playerModel`
   * to find players with a limit specified by the `limit` parameter. The method then sorts the players
   * based on their rank in
   * @returns The `find` method is returning a Promise that resolves to an array of `PlayerEntity`
   * objects. These objects are sorted based on the `rank` property of each player's data in ascending
   * order.
   */
  async find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = await this.playerModel.find({
        take: limit,
      });

      return Promise.resolve(players.sort((a, b) => a.data.rank - b.data.rank));
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function asynchronously finds a player by their ID, handling errors for invalid or
   * missing players.
   * @param {any} id - The `findOne` method you provided is an asynchronous function that takes an `id`
   * parameter of type `any`. The method attempts to find a player entity based on the provided `id`. If
   * the `id` is not a valid integer, a `BadRequestException` is thrown. If no player
   * @returns The `findOne` method returns a Promise that resolves to a `PlayerEntity` object if the
   * player with the specified `id` is found. If the `id` is not valid or the player is not found, it
   * will throw a `BadRequestException` or `NotFoundException` respectively.
   */
  async findOne(id: any): Promise<PlayerEntity> {
    try {
      if (!parseInt(id)) throw new BadRequestException(`id =${id} is invalid`);
      const player = await this.playerModel.findOneBy({ id });
      if (!player)
        throw new NotFoundException(`player with id = ${id} is not found`);

      return Promise.resolve(player);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function "statistics" retrieves player data, computes statistics such as median player height
   * and mean body mass index, and returns a StatisticEntity object.
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
   * The `onApplicationBootstrap` function deletes all existing player data and saves new player data in
   * a TypeScript application.
   */
  async onApplicationBootstrap() {
    await this.playerModel.delete({});
    for (const player of players) {
      await this.playerModel.save(player);
    }
  }
}
