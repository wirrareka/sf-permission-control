import { IsNotEmpty, validate, ValidationError } from 'class-validator'

import { MissingAttributeError, InvalidAttributeTypeError } from './errors'
import { Permission } from './permission'
import { Role } from './role'
import { Serializable } from './serializable'
import { Validable } from './validable'

/**
 * Grant defines connection between Permission and Role
 * if exists, access is granted
 *
 * @export
 * @class Grant
 */
export class Grant implements Serializable, Validable {
  public id: string

  @IsNotEmpty()
  permission: Permission

  @IsNotEmpty()
  role: Role

  constructor (role: Role | undefined, permission: Permission | undefined) {
    if (!role) {
      throw new MissingAttributeError('role')
    }
    if (!permission) {
      throw new MissingAttributeError('permission')
    }

    if (!(role instanceof Role)) {
      throw new InvalidAttributeTypeError('role')
    }

    if (!(permission instanceof Permission)) {
      throw new InvalidAttributeTypeError('permission')
    }

    this.role = role
    this.permission = permission
  }

  public serialize (): any {
    return {
      permission: this.permission.name,
      role: this.role.name
    }
  }

  public validate (): Promise<ValidationError[]> {
    return validate(this)
  }
}
