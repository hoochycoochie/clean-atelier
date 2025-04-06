import { Injectable } from '@nestjs/common';
import {
  PlayerEntity,
  PlayerEntityWithRatioWin,
} from 'core/entities/player.domain';
import { CountryStatistic } from 'infrastructure/jsonfile/types';
/* The PlayerUtils class in TypeScript provides static methods for computing median player height, mean
body mass index, and the country with the most win ratio among players. */

@Injectable()
export class PlayerUtils {
  /**
   * This TypeScript function computes the median height of players from a given array of heights.
   * @param {number[]} heights - The `heights` parameter is an array of numbers representing the heights
   * of players. The `computeMedianPlayerHeight` function calculates the median height of the players in
   * the provided array. If the array is empty or null, it throws an error indicating that the heights
   * are empty. The function then sorts
   * @returns The `computeMedianPlayerHeight` function returns a Promise that resolves to the median
   * player height in meters.
   */
  static async computeMedianPlayersHeight(heights: number[]): Promise<number> {
    try {
      if (!heights || !heights.length || heights.length === 0)
        throw new Error('heights empty');
      const mid = Math.floor(heights.length / 2);
      const nums = [...heights].sort((a, b) => a - b);
      const medianPlayerHeight =
        heights.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

      return Promise.resolve(medianPlayerHeight / 100);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function `computeMeanBodyMassIndex` calculates the mean body mass index of players based on
   * their weight and height data.
   * @param {PlayerEntity[]} players - The `computeMeanBodyMassIndex` function calculates the mean Body
   * Mass Index (BMI) for a given array of `PlayerEntity` objects. The BMI is calculated using the weight
   * and height data of each player.
   * @returns The `computeMeanBodyMassIndex` function is returning a Promise that resolves to a number,
   * which represents the mean Body Mass Index (BMI) calculated from the weight and height data of the
   * players in the `players` array.
   */
  static async computeMeanBodyMassIndex(
    players: PlayerEntity[],
  ): Promise<number> {
    try {
      if (!players || !players.length || players.length === 0)
        throw new Error('players empty');
      const results: number[] = [];
      players.forEach(async (player) => {
        try {
          let bodyMeanIndexByPlayer = 0;
          let weight = player?.data?.weight;
          let height = player?.data?.height;
          if (weight > 0 && height > 0) {
            weight = weight / 1000;
            height = height / 100;
            bodyMeanIndexByPlayer = weight / (height * height);
          }
          results.push(bodyMeanIndexByPlayer);
        } catch (error) {
          throw error;
        }
      });

      return Promise.resolve(results.reduce((a, b) => a + b) / results.length);
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function computes the country with the highest win ratio based on player data.
   * @param {PlayerEntity[]} players - The `computeMostWinRatioByCountry` function takes an array of
   * `PlayerEntity` objects as input. Each `PlayerEntity` object represents a player and contains
   * information such as their country code and match results.
   * @returns The `computeMostWinRatioByCountry` function returns a Promise that resolves to a string
   * representing the country with the highest win ratio among the players provided as input.
   */
  static async computeMostWinRatioByCountry(
    players: PlayerEntity[],
  ): Promise<string> {
    try {
      if (!players || !players.length) throw new Error('players empty');
      const playerEntityWithRatioWins: PlayerEntityWithRatioWin[] = players;

      const playersGroupedByCountry = Object.groupBy(
        playerEntityWithRatioWins,
        (player) => player.country.code,
      );

      const countryStatistics: CountryStatistic[] = [];
      for (const country in playersGroupedByCountry) {
        const countryStatistic: CountryStatistic = {
          country,
          totalLost: 0,
          totalWin: 0,
          winRatio: 0,
        };
        let totalLost = 0;
        let totalWin = 0;
        for (const player of playersGroupedByCountry[
          country
        ] as Array<PlayerEntity>) {
          const last = player?.data?.last;
          if (last && last.length > 0) {
            last.forEach((match) => {
              if (match === 1) totalWin++;
              if (match === 0) totalLost++;
            });
          }
        }
        countryStatistic.totalWin = totalWin;
        countryStatistic.totalLost = totalLost;
        countryStatistic.winRatio =
          (totalWin - totalLost) / (totalWin + totalLost);
        countryStatistics.push(countryStatistic);
      }
      const countryWithMostWinRatio = countryStatistics.sort(
        (a, b) => b.winRatio - a.winRatio,
      )[0].country;
      return Promise.resolve(countryWithMostWinRatio);
    } catch (error) {
      throw error;
    }
  }
}
