import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { players } from '../../const';
import { Player } from '../entities/player.entity';
import { PlayerPostgresdbRepositoryService } from './player-postgresdb-repository.service';

describe('PlayerPostgresdbRepositoryService', () => {
  let service: PlayerPostgresdbRepositoryService;
  const playerModel = {
    findOneBy: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerPostgresdbRepositoryService,

        {
          provide: getRepositoryToken(Player),
          useValue: playerModel,
        },
      ],
    }).compile();

    service = module.get<PlayerPostgresdbRepositoryService>(
      PlayerPostgresdbRepositoryService,
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
      jest.spyOn(playerModel, 'findOneBy').mockResolvedValue(undefined);
      expect(async () => {
        await service.findOne(2);
      }).rejects.toThrow(NotFoundException);
    });

    it('should found right user', async () => {
      jest.spyOn(playerModel, 'findOneBy').mockResolvedValue(players[0]);
      const player = await expect(service.findOne(players[0].id));
      expect(player).toBeDefined();
    });
  });

  describe('find players', () => {
    it('should return players order by rank asc', async () => {
      jest
        .spyOn(playerModel, 'find')
        .mockResolvedValue(
          players.slice(0, 2).sort((a, b) => a.data.rank - b.data.rank),
        );
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
