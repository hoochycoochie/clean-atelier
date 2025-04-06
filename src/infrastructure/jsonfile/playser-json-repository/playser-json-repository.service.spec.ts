import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { players } from '../../const';
import { PlayerJsonRepositoryService } from './playser-json-repository.service';

describe('PlayerJsonRepositoryService', () => {
  let service: PlayerJsonRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerJsonRepositoryService],
    }).compile();

    service = module.get<PlayerJsonRepositoryService>(
      PlayerJsonRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne player', () => {
    it('should throw not found if player not found', async () => {
      expect(async () => {
        await service.findOne(12222222222222222);
      }).rejects.toThrow(NotFoundException);
    });

    it('should found right user', async () => {
      const firstPlayerId = players[0].id;
      const player = await expect(service.findOne(firstPlayerId as number));
      expect(player).toBeDefined();
    });
  });

  describe('find players', () => {
    it('should return players order by rank asc', async () => {
      const users = await service.find({ limit: 2 });
      expect(users.length).toEqual(2);
      expect(users[0].data.rank).toBeLessThanOrEqual(users[1].data.rank);
    });
  });

  describe('statistics ,BodyMassIndex,WinRation,by country', () => {
    it('should return players order by rank asc', async () => {
      const { countryWithMostWinRatio, meanBodyMassIndex, medianPlayerHeight } =
        await service.statistics();
      expect(countryWithMostWinRatio).toBeDefined();
      expect(meanBodyMassIndex).toBeDefined();
      expect(medianPlayerHeight).toBeDefined();
    });
  });
});
