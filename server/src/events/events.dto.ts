import { IsNotEmpty } from 'class-validator';

export class PlayerUpdateDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  playerId: string;

  // TODO: Update for game move data
  @IsNotEmpty()
  message: string;
}
