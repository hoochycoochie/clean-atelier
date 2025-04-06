import { players } from '../const';
import { PlayerUtils } from './player.util';

describe('PlayerUtils', () => {
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
