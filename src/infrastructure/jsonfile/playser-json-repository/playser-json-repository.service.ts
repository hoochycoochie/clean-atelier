import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerEntity } from 'core/entities/player.domain';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { players } from '../../const';
import { PlayerUtils } from '../../utils';

/* The PlayerJsonRepositoryService class implements methods to retrieve player data and statistics from
a JSON repository. */
@Injectable()
export class PlayerJsonRepositoryService implements IPlayerRepository {
  players: PlayerEntity[] = [];
  constructor() {
    this.players = players;
  }

  /**
   * The function `find` asynchronously sorts and returns a limited number of player entities based on
   * their rank.
   * @param {PaginationParams}  - The `find` method takes a `PaginationParams` object as a parameter,
   * which includes a `limit` property indicating the maximum number of items to return. The method sorts
   * the `players` array based on the `rank` property of each player's data. If the `limit` provided is
   * @returns The `find` method returns a Promise that resolves to an array of `PlayerEntity` objects.
   * The method first sorts the `players` array based on the `rank` property of each player's data. If
   * the `limit` parameter is greater than the total number of players in the array, it returns a Promise
   * that resolves to the entire sorted `players` array. Otherwise, it returns a
   */
  async find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = this.players.sort(
        (p1, p2) => p1.data.rank - p2.data.rank,
      );
      if (limit > this.players.length) return Promise.resolve(players);
      return Promise.resolve(players.slice(0, limit));
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function asynchronously finds a player entity by its ID and returns a Promise with
   * the result.
   * @param {number} id - The `id` parameter in the `findOne` method is a number that represents the
   * unique identifier of the player entity that you want to find in the `players` array.
   * @returns The `findOne` method is returning a Promise that resolves to a `PlayerEntity` object.
   */
  async findOne(id: number): Promise<PlayerEntity> {
    try {
      const index = this.players.findIndex((p) => p?.id === id);
      if (index < 0)
        throw new NotFoundException(`player with id = ${id} is not found`);
      const playerFound = this.players[index];
      return Promise.resolve(playerFound);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function "statistics" asynchronously calculates and returns various statistics related to player
   * data.
   * @returns The `statistics()` method returns a Promise that resolves to a `StatisticEntity` object
   * containing the following properties:
   * - `countryWithMostWinRatio`: a string representing the country with the most win ratio
   * - `meanBodyMassIndex`: a number representing the mean body mass index
   * - `medianPlayerHeight`: a number representing the median player height
   */
  async statistics(): Promise<StatisticEntity> {
    try {
      const players = this.players;
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
}
