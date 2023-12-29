import { Injectable } from '@nestjs/common';
import { Room, GameStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  RoomNotFoundException,
  RoomFullException,
  RoomBadRequestException,
  RoomIncorrectHashException,
  RoomEmptyException,
} from 'exceptions/room';
import {
  PlayerNotFoundException,
  PlayerUnauthorizedException,
} from 'exceptions/player';
import { randomUUID } from 'crypto';
import { GameService } from 'src/game/game.service';
import { MAX_OCCUPANTS } from 'consts/room';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly game: GameService,
  ) {}

  async getAllRoomsWithDateDesc(): Promise<
    Pick<Room, 'id' | 'protected' | 'occupants' | 'name'>[]
  > {
    return await this.prisma.room.findMany({
      select: {
        id: true,
        name: true,
        protected: true,
        occupants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Creates a room record given optional password. Joins the created room.

   * @param roomDetails record of optional password and name
   * @returns created room record
   */
  async createRoom(roomDetails: { name: string; password: string | null }) {
    const { name, password } = roomDetails;
    const playerId = randomUUID();

    const input: {
      name: string;
      players: [string];
      protected: boolean;
      hash?: string;
      salt?: string;
    } = { name, protected: password !== null, players: [playerId] };

    if (password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      input.hash = hash;
      input.salt = salt;
    }

    const createdRoom = await this.prisma.room.create({
      data: input,
      select: {
        id: true,
      },
    });

    return { roomId: createdRoom.id, playerId };
  }

  /**
   * Attempts to join roomId given a provided hash. Throws an exception if hash does not match
   * or if there are any other errors with joining the room.
   *
   * @param roomId id of room requesting to join
   * @param password attempted password
   */
  async joinRoom(
    roomId: string,
    password: string | null,
    playerId: string | null,
  ) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!room) throw new RoomNotFoundException();

    const currentOccupants = room?.occupants;
    if (currentOccupants === MAX_OCCUPANTS) throw new RoomFullException();

    if (room.protected) {
      if (password === null)
        throw new RoomBadRequestException('Password not supplied.');
      const hash = await bcrypt.hash(password, room.salt!);
      if (room.hash !== hash) throw new RoomIncorrectHashException();
    }

    if (playerId === null && room.players.length === MAX_OCCUPANTS)
      throw new PlayerUnauthorizedException();

    if (
      playerId !== null &&
      room.players.length === MAX_OCCUPANTS &&
      !room.players.includes(playerId)
    )
      throw new PlayerUnauthorizedException();

    const updateQuery: Record<string, any> = {
      occupants: currentOccupants + 1,
    };

    if (playerId === null && room.players.length < MAX_OCCUPANTS) {
      playerId = randomUUID();
      updateQuery.players = { push: playerId };
    }

    const updatedRoom = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: updateQuery,
      include: {
        game: true,
      },
    });

    if (updatedRoom.occupants === MAX_OCCUPANTS && updatedRoom.game === null) {
      await this.game.initializeGame(roomId);
    }

    return { playerId };
  }

  /**
   * Leaves room provided its id. Does **not** destroy room immediately upon 0 occupancy.
   * TODO: Destructing a room should be on a x minute delay via SQS.
   *
   * @param roomId id of room to leave
   */
  async leaveRoom(roomId: string, playerId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!room) throw new RoomNotFoundException('Room not found.');
    if (room.occupants === 0) throw new RoomEmptyException();
    if (!room.players.includes(playerId)) throw new PlayerNotFoundException();

    if (room.occupants === 1) {
      await this.prisma.room.delete({
        where: {
          id: roomId,
        },
      });
      return;
    }

    const updatedRoom = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        // players: room.players.filter((player) => player !== playerId),
        occupants: room.occupants - 1,
      },
    });

    return;
  }
}
