import { IsNotEmpty, IsString, validate, ValidationError } from 'class-validator'

import { MissingAttributeError } from './errors'
import { Serializable } from './serializable'
import { Validable } from './validable'

/**
 * Permission carries label of protected functionality
 *
 * @export
 * @class Permission
 */
export class Permission implements Serializable, Validable {
  public id: string
  @IsNotEmpty()
  @IsString()
  name: string

  constructor (name: string) {
    if (!name) {
      throw new MissingAttributeError('name')
    }

    this.name = name
  }

  public serialize (): any {
    return { name: this.name }
  }

  public validate (): Promise<ValidationError[]> {
    return validate(this)
  }
}
