import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomService } from './room/room.service';
import { RoomModule } from './room/room.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_PIPE } from '@nestjs/core';
import { GameService } from './game/game.service';
import { GameModule } from './game/game.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [RoomModule, GameModule, EventsModule],
  controllers: [AppController],
  providers: [AppService, RoomService, PrismaService, GameService],
})
export class AppModule {}
