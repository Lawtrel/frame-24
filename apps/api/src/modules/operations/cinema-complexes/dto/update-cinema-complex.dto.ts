import { createZodDto } from 'nestjs-zod';
import { CinemaComplexSchema } from 'src/modules/operations/cinema-complexes/dto/cinema-complex.schema';

const UpdateCinemaComplexSchema = CinemaComplexSchema.partial();

export class UpdateCinemaComplexDto extends createZodDto(
  UpdateCinemaComplexSchema,
) {}
