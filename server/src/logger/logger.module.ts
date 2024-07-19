import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

const prettyStream = pretty({
    colorize: true,
    levelFirst: true,
    translateTime: 'SYS:standard',
});

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard',
        }
    }
}, prettyStream);

@Module({
    imports: [
        PinoLoggerModule.forRoot({
            pinoHttp: {
                logger,
                serializers: {
                    req: (req) => ({
                        id: req.id,
                        method: req.method,
                        url: req.url,
                        query: req.query,
                        params: req.params,
                        headers: req.headers,
                    }),
                },
            },
        }),
    ],
    exports: [PinoLoggerModule],
})
export class LoggerModule { }