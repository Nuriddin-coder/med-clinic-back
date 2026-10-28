import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { DoctorsModule } from '../doctors/doctors.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [DoctorsModule, ServicesModule],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}

