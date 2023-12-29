import { Injectable } from '@nestjs/common';
import { GameNotInitializedException } from 'exceptions/game';
import { RoomNotFoundException } from 'exceptions/room';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateGame(roomId: string, playerId: string, message: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        game: true,
      },
    });

    if (!room) throw new RoomNotFoundException();
    if (room.game === null) throw new GameNotInitializedException();

    const updatedGame = await this.prisma.game.update({
      where: {
        id: room.game.id,
      },
      data: {
        log: {
          create: {
            message,
          },
        },
      },
      include: {
        log: true,
      },
    });

    return { gameId: room.game.id };
  }
}
