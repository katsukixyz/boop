import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsService } from './events.service';

@Module({
  providers: [EventsGateway, EventsService, PrismaService],
})
export class EventsModule {}
