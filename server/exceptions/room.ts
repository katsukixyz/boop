export class RoomNotFoundException extends Error {
  constructor(message = 'Room not found.') {
    super(message);
  }
}
export class RoomFullException extends Error {
  constructor(message = 'Room is full.') {
    super(message);
  }
}
export class RoomIncorrectHashException extends Error {
  constructor(message = 'Password is incorrect.') {
    super(message);
  }
}
export class RoomBadRequestException extends Error {}

export class RoomEmptyException extends Error {
  constructor(message = 'Room is empty.') {
    super(message);
  }
}
