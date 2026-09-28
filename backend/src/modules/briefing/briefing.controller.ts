import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BriefingSchema } from '@remora/core';
import type { BriefingData, BriefingResponse } from '@remora/core';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BriefingService } from './briefing.service';
import { UpdateStatusSchema, UpdateStatusDto } from './dto/update-status.dto';

/**
 * BriefingController — endpoints HTTP da feature.
 *
 *  POST   /briefing              cria briefing (valida via BriefingSchema)
 *  GET    /briefing              lista todos
 *  GET    /briefing/:id          recupera um
 *  PATCH  /briefing/:id/status   atualiza status
 */
@Controller('briefing')
export class BriefingController {
  constructor(private readonly service: BriefingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(BriefingSchema)) data: BriefingData,
  ): Promise<BriefingResponse> {
    return this.service.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<BriefingResponse[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<BriefingResponse> {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ZodValidationPipe(UpdateStatusSchema)) body: UpdateStatusDto,
  ): Promise<BriefingResponse> {
    return this.service.updateStatus(id, body.status);
  }
}
