import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerFindByIdUseCase } from 'core/use-cases/player-findbyId.usecase';
import { PlayerListUseCase } from 'core/use-cases/player-list.usecase';
import { PlayerStatsUseCase } from 'core/use-cases/player-stats.usecase';
import { ApiResponseType } from 'infrastructure/common/swagger/response.decorator';
import { UseCaseProxy } from 'infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'infrastructure/usecases-proxy/usecases-proxy.module';

import { FindPlayersDto } from './dto/find-player-list.dto';
import { PlayerDto } from './dto/player.dto';
import { StaticticDto } from './dto/statistic.dto';
/* The PlayerController class in TypeScript defines endpoints for retrieving player statistics, finding
a player by ID, and listing all players. */

@Controller('players')
@ApiTags('players')
@ApiResponse({ status: 500, description: 'Internal error' })
export class PlayerController {
  constructor(
    @Inject(UsecasesProxyModule.PLAYER_FIND_BY_ID_PROXY)
    private readonly playerFindByIdUseCase: UseCaseProxy<PlayerFindByIdUseCase>,

    @Inject(UsecasesProxyModule.PLAYER_LIST_PROXY)
    private readonly playerListUseCase: UseCaseProxy<PlayerListUseCase>,

    @Inject(UsecasesProxyModule.PLAYER_STATS_PROXY)
    private readonly playerStatsUseCase: UseCaseProxy<PlayerStatsUseCase>,
  ) {}
  /* This part of the code is defining a GET endpoint `/players/statistics` in the `PlayerController`
class. Here's a breakdown of what it does: */
  @Get('statistics')
  @ApiResponseType(StaticticDto, false)
  getStatistics(): Promise<StaticticDto> {
    return this.playerStatsUseCase.getInstance().execute();
  }

  /* This part of the code is defining a GET endpoint in the `PlayerController` class that expects a
parameter `id` in the URL path. Here's a breakdown of what each annotation does: */
  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'of tennis player' })
  @ApiResponseType(PlayerDto, false)
  findOne(@Param('id') id: any): Promise<PlayerDto> {
    return this.playerFindByIdUseCase
      .getInstance()
      .execute(id) as Promise<PlayerDto>;
  }

  /* This part of the code is defining a POST endpoint in the `PlayerController` class. The endpoint is
accessed through the `/players` route. Here's a breakdown of what it does: */
  @Post()
  findAll(@Body() data: FindPlayersDto): Promise<PlayerDto[]> {
    return this.playerListUseCase.getInstance().execute(data) as Promise<
      PlayerDto[]
    >;
  }
}
