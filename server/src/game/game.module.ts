import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [GameController],
})
export class GameModule {}
