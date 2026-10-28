import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { DoctorsModule } from '../doctors/doctors.module';
import { ServicesModule } from '../services/services.module';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [DoctorsModule, ServicesModule, SlotsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

