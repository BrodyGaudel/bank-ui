export class ExceptionResponse {
  code!: number;
  message!: string;
  description!: string;
  validationErrors!: Set<string>;
  errors!: Map<string, string>;
}
