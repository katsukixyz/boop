import { Test, TestingModule } from '@nestjs/testing';
import { Room } from './room';

describe('Room', () => {
  let provider: Room;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Room],
    }).compile();

    provider = module.get<Room>(Room);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
