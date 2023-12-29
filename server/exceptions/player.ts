export class PlayerNotFoundException extends Error {
  constructor(message = 'Not a player of room.') {
    super(message);
  }
}

export class PlayerUnauthorizedException extends Error {
  constructor(message = 'Player is not authorized to join this room.') {
    super(message);
  }
}
