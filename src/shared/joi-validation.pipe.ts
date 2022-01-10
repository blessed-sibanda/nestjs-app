import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(val: any, metadata: ArgumentMetadata) {
    const { error, value } = this.schema.validate(val);
    if (error) throw new BadRequestException(error.details[0].message);
    return value;
  }
}
