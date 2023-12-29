import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerUpdateDto } from './events.dto';
import { RoomNotFoundException } from 'exceptions/room';
import { GameNotInitializedException } from 'exceptions/game';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}

@WebSocketGateway({
  cors: true,
})
export class EventsGateway {
  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage('playerUpdate')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseFilters(BadRequestTransformationFilter)
  async handleGameEvent(
    @MessageBody() playerUpdateDto: PlayerUpdateDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, playerId, message } = playerUpdateDto;
    try {
      const { gameId } = await this.eventsService.updateGame(
        roomId,
        playerId,
        message,
      );
      client.emit('gameUpdate', {
        gameId,
      });
    } catch (e: unknown) {
      throw new WsException((e as Error).message);
    }
  }
}
