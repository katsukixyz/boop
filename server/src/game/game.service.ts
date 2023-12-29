import { Injectable } from '@nestjs/common';
import { GameStatus } from '@prisma/client';
import { MAX_OCCUPANTS } from 'consts/room';
import {
  GameAlreadyInProgressException,
  GameStartConditionsUnmetException,
} from 'exceptions/game';
import { RoomNotFoundException } from 'exceptions/room';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes game in provided room id (sets gameStatus to pre-game).
   *
   * @param roomId room id
   */
  async initializeGame(roomId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        game: true,
      },
    });

    if (!room) throw new RoomNotFoundException();
    if (room.game !== null) throw new GameAlreadyInProgressException();
    if (room.occupants !== MAX_OCCUPANTS)
      throw new GameStartConditionsUnmetException(
        'Room must be full to start game.',
      );

    const initializedRoom = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        game: {
          create: {
            status: GameStatus.PRE_GAME,
          },
        },
      },
    });

    return;
  }
}
