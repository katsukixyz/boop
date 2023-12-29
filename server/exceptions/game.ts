export class GameStartConditionsUnmetException extends Error {}
export class GameAlreadyInProgressException extends Error {
  constructor(message = 'Cannot start game already in progress.') {
    super(message);
  }
}
export class GameNotInitializedException extends Error {
  constructor(message = 'Game has not yet been initialized.') {
    super(message);
  }
}
