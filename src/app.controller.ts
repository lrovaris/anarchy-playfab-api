import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('General')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Hello World endpoint' })
  @ApiResponse({ status: 200, description: 'Returns a hello world message.' })
  helloWorld(): string {
    return 'Hello World!';
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns a health status.' })
  healthCheck(): object {
    return { status: 'Healthy' };
  }
}
