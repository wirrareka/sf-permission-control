import { IsString, validate, ValidationError } from 'class-validator'

import { MissingAttributeError } from './errors'
import { Serializable } from './serializable'
import { Validable } from './validable'

/**
 * Role is identifier class for further access authorization
 *
 * @export
 * @class Role
 */
export class Role implements Serializable, Validable {
  public id: string
  @IsString()
  name: string

  constructor (name: string) {
    if (!name) {
      throw new MissingAttributeError('name')
    }

    this.name = name
  }

  public validate (): Promise<ValidationError[]> {
    return validate(this)
  }

  serialize () {
    return { name: this.name }
  }

}
