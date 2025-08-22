import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { GeminiService } from 'src/core/services/gemini.service';

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  async create(createConnectionDto: CreateConnectionDto) {
    const { fromCity, toCity } = createConnectionDto;
    const normalizedFromCity =
      (await fromCity.charAt(0).toUpperCase()) +
      fromCity.slice(1).toLowerCase();
    const normalizedToCity =
      (await toCity.charAt(0).toUpperCase()) + toCity.slice(1).toLowerCase();
    await this.ensureCityExists(fromCity);
    await this.ensureCityExists(toCity);
    createConnectionDto.fromCity = normalizedFromCity;
    createConnectionDto.toCity = normalizedToCity;
    return this.prisma.connection.create({
      data: createConnectionDto,
    });
  }

  private async ensureCityExists(name: string) {
    const normalizedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const city = await this.prisma.city.findUnique({
      where: { name: normalizedName },
    });

    if (!city) {
      const newCity = await this.prisma.city.create({
        data: { name: normalizedName },
      });
      const imageUrl = await this.geminiService.generateImage(
        normalizedName,
        newCity.id,
      );

      await this.prisma.city.update({
        where: { id: newCity.id },
        data: { imageUrl },
      });
    }
  }

  async findAll() {
    return this.prisma.connection.findMany();
  }

  async update(id: number, updateConnectionDto: UpdateConnectionDto) {
    const connection = await this.prisma.connection.findUnique({
      where: { id },
    });
    if (!connection) {
      throw new NotFoundException(`Connection with ID ${id} not found.`);
    }
    return this.prisma.connection.update({
      where: { id },
      data: updateConnectionDto,
    });
  }

  async remove(id: number) {
    const connection = await this.prisma.connection.findUnique({
      where: { id },
    });
    if (!connection) {
      throw new NotFoundException(`Connection with ID ${id} not found.`);
    }
    return this.prisma.connection.delete({
      where: { id },
    });
  }
}
