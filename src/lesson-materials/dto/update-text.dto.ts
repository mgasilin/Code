import { PartialType } from '@nestjs/swagger';
import { CreateTextDto } from './create-text.dto';

export class UpdateTextDto extends PartialType(CreateTextDto) {}