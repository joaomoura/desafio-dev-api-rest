import { OperacaoModule } from './operacao/operacao.module';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pessoa } from './pessoa/pessoa.entity';
import { PessoasModule } from './pessoa/pessoa.module';
import { Conta } from './conta/conta.entity';
import { Transacao } from './transacao/transacao.entity';
import { TransacaoModule } from './transacao/transacao.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { TransformResponseInterceptor } from './core/http/transformResponse.interceptor';
import { ContaModule } from './conta/conta.module';
import 'dotenv/config';

@Module({
    imports: [
        PessoasModule,
        ContaModule,
        TransacaoModule,
        OperacaoModule,
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.DATABASE_HOST || 'localhost',
            port: 3306,
            username: process.env.DATABASE_USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            autoLoadModels: true,
            synchronize: true,
        }),
        SequelizeModule.forFeature([Pessoa, Conta, Transacao])
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformResponseInterceptor
        },
        AppService,
    ],
})
export class AppModule { }
