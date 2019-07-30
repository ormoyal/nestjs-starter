import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: false});
  // app.useGlobalFilters(new ErrorFilter());

  await app.listen(3003);
}
bootstrap();
