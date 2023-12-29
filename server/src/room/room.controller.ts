import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto } from './room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'List all rooms, date descending.' })
  @Get()
  async getRooms() {
    return await this.roomService.getAllRoomsWithDateDesc();
  }

  @Post('create')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const { name, password = null } = createRoomDto;
    return await this.roomService.createRoom({ name, password });
  }

  @Post('join')
  async joinRoom(@Body() joinRoomDto: JoinRoomDto) {
    const { id, password = null, playerId = null } = joinRoomDto;
    try {
      return await this.roomService.joinRoom(id, password, playerId);
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Post('leave')
  async leaveRoom(@Body() leaveRoomDto: LeaveRoomDto) {
    const { roomId, playerId } = leaveRoomDto;
    try {
      return await this.roomService.leaveRoom(roomId, playerId);
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }
}
