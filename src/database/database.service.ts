// database.service.ts
import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    public readonly sql;

    constructor(public configService: ConfigService) {
        const databaseUrl = this.configService.get('DATABASE_URL');
        this.sql = neon(databaseUrl);
    }
    async getData() {
        const data = await this.sql`...`;
        return data;
    }
}