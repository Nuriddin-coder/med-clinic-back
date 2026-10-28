import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClinicModule } from './clinic/clinic.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ServicesModule } from './services/services.module';
import { SlotsModule } from './slots/slots.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClinicModule,
    SpecialtiesModule,
    DoctorsModule,
    ServicesModule,
    SlotsModule,
    AppointmentsModule,
    ContactModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
