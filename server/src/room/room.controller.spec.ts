import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, Room } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CreateRoomDto } from './room.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('RoomController', () => {
  let controller: RoomController;
  let provider: RoomService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [RoomService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<RoomController>(RoomController);
    provider = module.get<RoomService>(RoomService);
    prisma = module.get(PrismaService);
  });

  it('controller and provider defined, expect success', () => {
    expect(controller).toBeDefined();
    expect(provider).toBeDefined();
  });

  describe('createRoom', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const roomDetails = {
      id: faker.string.uuid(),
      name: faker.string.sample(10),
      createdAt: new Date(),
      protected: true,
      occupants: 1,
      password: faker.string.sample(20),
    };

    it('password populated (protected room), expect success', async () => {
      const { name, password, ...metadata } = roomDetails;
      prisma.room.create.mockResolvedValueOnce(metadata as Room); //workaround for select clause in prisma.room.create

      const dto = new CreateRoomDto();
      dto.name = name;
      dto.password = password;

      expect(await controller.createRoom(dto)).toBe(metadata);
    });

    it('password unpopulated (unprotected room), expect success', async () => {
      const { name, password, ...metadata } = roomDetails;
      prisma.room.create.mockResolvedValueOnce(metadata as Room); //workaround for select clause in prisma.room.create

      const dto = new CreateRoomDto();
      dto.name = name;

      expect(await controller.createRoom(dto)).toBe(metadata);
    });
  });
});
