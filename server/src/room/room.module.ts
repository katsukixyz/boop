import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from 'src/game/game.service';

@Module({
  providers: [RoomService, PrismaService, GameService],
  controllers: [RoomController],
})
export class RoomModule {}
