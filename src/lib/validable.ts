import { ValidationError } from 'class-validator'

export interface Validable {
  validate (): Promise<ValidationError[]>
}
