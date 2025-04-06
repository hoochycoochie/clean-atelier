import { PlayerEntity } from 'core/entities/player.domain';
import { PlayerUtils } from './player.util';

describe('PlayerUtils', () => {
  const players: PlayerEntity[] = [
    {
      id: 52,
      firstname: 'Novak',
      lastname: 'Djokovic',
      shortname: 'N.DJO',
      sex: 'M',
      country: {
        picture: 'https://tenisu.latelier.co/resources/Serbie.png',
        code: 'SRB',
      },
      picture: 'https://tenisu.latelier.co/resources/Djokovic.png',
      data: {
        rank: 2,
        points: 2542,
        weight: 80000,
        height: 188,
        age: 31,
        last: [1, 1, 1, 1, 1],
      },
    },
    {
      id: 95,
      firstname: 'Venus',
      lastname: 'Williams',
      shortname: 'V.WIL',
      sex: 'F',
      country: {
        picture: 'https://tenisu.latelier.co/resources/USA.png',
        code: 'USA',
      },
      picture: 'https://tenisu.latelier.co/resources/Venus.webp',
      data: {
        rank: 52,
        points: 1105,
        weight: 74000,
        height: 185,
        age: 38,
        last: [0, 1, 0, 0, 1],
      },
    },
    {
      id: 65,
      firstname: 'Stan',
      lastname: 'Wawrinka',
      shortname: 'S.WAW',
      sex: 'M',
      country: {
        picture: 'https://tenisu.latelier.co/resources/Suisse.png',
        code: 'SUI',
      },
      picture: 'https://tenisu.latelier.co/resources/Wawrinka.png',
      data: {
        rank: 21,
        points: 1784,
        weight: 81000,
        height: 183,
        age: 33,
        last: [1, 1, 1, 0, 1],
      },
    },
    {
      id: 102,
      firstname: 'Serena',
      lastname: 'Williams',
      shortname: 'S.WIL',
      sex: 'F',
      country: {
        picture: 'https://tenisu.latelier.co/resources/USA.png',
        code: 'USA',
      },
      picture: 'https://tenisu.latelier.co/resources/Serena.png',
      data: {
        rank: 10,
        points: 3521,
        weight: 72000,
        height: 175,
        age: 37,
        last: [0, 1, 1, 1, 0],
      },
    },
    {
      id: 17,
      firstname: 'Rafael',
      lastname: 'Nadal',
      shortname: 'R.NAD',
      sex: 'M',
      country: {
        picture: 'https://tenisu.latelier.co/resources/Espagne.png',
        code: 'ESP',
      },
      picture: 'https://tenisu.latelier.co/resources/Nadal.png',
      data: {
        rank: 1,
        points: 1982,
        weight: 85000,
        height: 185,
        age: 33,
        last: [1, 0, 0, 0, 1],
      },
    },
  ];

  describe('computeMedianPlayerHeight', () => {
    it('should return right median', async () => {
      const input = [185, 185, 185, 180, 178, 180];
      const median = await PlayerUtils.computeMedianPlayersHeight(input);
      expect(median).toEqual(1.825);
    });
  });

  describe('computeMeanBodyMassIndex', () => {
    it('should return computeMeanBodyMassIndex', async () => {
      const median = await PlayerUtils.computeMeanBodyMassIndex(players);
      expect(median).toEqual(23.357838995505837);
    });

    it('should throw error if occurs', async () => {
      await expect(PlayerUtils.computeMeanBodyMassIndex([])).rejects.toThrow();
    });
  });
});
