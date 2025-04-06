import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import DS from './data-source';
import { Player } from './entities/player.entity';
import { PlayerPostgresdbRepositoryService } from './player-postgresdb-repository/player-postgresdb-repository.service';
@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [
    PlayerPostgresdbRepositoryService,
    {
      provide: DataSource, // add the datasource as a provider
      inject: [],
      useFactory: async () => {
        // using the factory function to create the datasource instance
        try {
          if (!DS.isInitialized) await DS.initialize(); // initialize the data source
          console.log('Database connected successfully');
          return DS;
        } catch (error) {
          console.log('Error connecting to database', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource, PlayerPostgresdbRepositoryService],
})
export class PostgresdbModule {}
