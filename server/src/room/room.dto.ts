import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  password?: string;
}

export class JoinRoomDto {
  @IsUUID()
  id: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  playerId?: string;
}

export class LeaveRoomDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsUUID()
  playerId: string;
}
