import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { players } from '../../const';
import { Player } from '../schemas';
import { PlayerMongodbRepositoryService } from './player-mongodb-repository.service';

describe('PlayerMongodbRepositoryService', () => {
  let service: PlayerMongodbRepositoryService;
  const playerModel = {
    findById: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerMongodbRepositoryService,
        {
          provide: getModelToken(Player.name),
          useValue: playerModel,
        },
      ],
    }).compile();

    service = module.get<PlayerMongodbRepositoryService>(
      PlayerMongodbRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw error if id invalid id', async () => {
      expect(async () => {
        await service.findOne('aaa');
      }).rejects.toThrow();
    });
    it('should throw error if player not found', async () => {
      jest.spyOn(playerModel, 'findById').mockResolvedValue(undefined);
      expect(async () => {
        await service.findOne('67f27c486bb9f6d80119de05');
      }).rejects.toThrow(NotFoundException);
    });

    it('should found right user', async () => {
      jest.spyOn(playerModel, 'findById').mockResolvedValue(players[0]);
      const player = await expect(service.findOne('67f27c486bb9f6d80119de05'));
      expect(player).toBeDefined();
    });
  });

  describe('find players', () => {
    it('should return players order by rank asc', async () => {
      jest.spyOn(playerModel, 'find').mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
          sort: jest
            .fn()
            .mockResolvedValue(
              players.slice(0, 2).sort((a, b) => a.data.rank - b.data.rank),
            ),
        })),
      }));
      const users = await service.find({ limit: 2 });
      expect(users.length).toEqual(2);
      expect(users[0].data.rank).toBeLessThanOrEqual(users[1].data.rank);
    });
  });

  describe('statistics ,BodyMassIndex,WinRation,by country', () => {
    it('should return players order by rank asc', async () => {
      jest.spyOn(playerModel, 'find').mockResolvedValue(players);
      const { countryWithMostWinRatio, meanBodyMassIndex, medianPlayerHeight } =
        await service.statistics();
      expect(countryWithMostWinRatio).toBeDefined();
      expect(meanBodyMassIndex).toBeDefined();
      expect(medianPlayerHeight).toBeDefined();
    });
  });
});
