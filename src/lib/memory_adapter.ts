const uuid = require('uuid')
import { ModelValidationError, UniqueConstrainViolationError, DocumentNotFoundError } from './errors'
import { DataAdapterInterface, DataAdapterOptions, DataAdapter } from './data_adapter'
import { Validable } from './validable'
import { Serializable } from './serializable'
import { Permission } from './permission'
import { Grant } from './grant'
import { Role } from './role'

export interface FetchableClass {
  new (options: any): Role | Permission | Grant
}

export class MemoryAdapter extends DataAdapter implements DataAdapterInterface {
  private permissions: Permission[]
  private roles: Role[]
  private grants: Grant[]

  constructor (options: DataAdapterOptions) {
    super(options)
    this.options.type = 'memory'
  }

  public async connect (): Promise<MemoryAdapter> {
    this.permissions = []
    this.roles = []
    this.grants = []
    await this.prepare()
    this.connected = true
    return this
  }

  public async prepare (): Promise<MemoryAdapter> {
    return this
  }

  public async migrate (): Promise<MemoryAdapter> {
    return this
  }

  // Role

  public async getRoles (): Promise<Role[]> {
    return this.findMany(Role, {}, this.roles)
  }

  public async createRole (role: Role): Promise<Role> {
    return this.createRecord(role, this.roles)
  }

  public async updateRole (role: Role): Promise<Role> {
    return this.updateRecord(role, this.roles)
  }

  // Permission

  public async getPermissions (): Promise<Permission[]> {
    return this.findMany(Permission, {}, this.permissions)
  }

  public async createPermission (permission: Permission): Promise<Permission> {
    return this.createRecord(permission, this.permissions)
  }

  public async updatePermission (permission: Permission): Promise<Permission> {
    return this.updateRecord(permission, this.permissions)
  }

  // Grant

  public async getGrants (): Promise<Grant[]> {
    return this.grants
  }

  public async createGrant (grant: Grant): Promise<Grant> {
    return this.createRecord(grant, this.grants)
  }

  public async updateGrant (grant: Grant): Promise<Grant> {
    return this.updateRecord(grant, this.grants)
  }

  // Data Abstraction methods
  // public async findOne (Klass: FetchableClass, filter: any, datastore: any): Promise<any> {
  //   try {
  //     const document: any = await datastore.findOne(filter)
  //     return new Klass(this.deserialize(document))
  //   } catch (error) {
  //     throw new DocumentNotFoundError(Klass.name, JSON.stringify(filter))
  //   }
  // }

  public async findMany (Klass: FetchableClass, filter: any, datastore: any): Promise<any[]> {
    const _filter = Object.assign(filter, this.filter)
    let documents: any
    if (Object.keys(_filter).length > 0) {
      documents = datastore.filter((i: any) => {
        const keys = Object.keys(_filter)
        const matches: boolean[] = []
        keys.forEach((k) => {
          if (i[k] === _filter[k]) {
            matches.push(true)
          }
        })
        return matches.length === keys.length
      })
      return documents.map((document: any) => new Klass(this.deserialize(document).name))
    } else {
      return datastore
    }
  }

  public async createRecord (entity: Serializable & Validable, datastore: any): Promise<any> {
    const validationErrors = await entity.validate()
    if (validationErrors && validationErrors.length > 0) {
      throw new ModelValidationError(validationErrors)
    }
    if (typeof entity.id === 'undefined') {
      entity.id = uuid.v4()
    }
    if (datastore.find((i: any) => i.id === entity.id)) {
      throw new UniqueConstrainViolationError(`id: ${entity.id} already exists`)
    }
    datastore.push(this.serialize(entity))
    return entity
  }

  public async updateRecord (entity: Serializable & Validable, datastore: any): Promise<any> {
    const validationErrors = await entity.validate()
    if (validationErrors && validationErrors.length > 0) {
      throw new ModelValidationError(validationErrors)
    }
    try {
      const document: Serializable & Validable = datastore.find((i: Serializable) => i.id === entity.id)
      Object.assign(document, this.serialize(entity))
      return document
    } catch (error) {
      if (error.errorType === 'uniqueViolated') {
        throw new UniqueConstrainViolationError(error.message)
      } else {
        throw error
      }
    }
  }
  public async removeRole (role: Role): Promise<Number> {
    return this.remove({ name: role.name }, this.roles)
  }

  public async removeGrant (grant: Grant): Promise<Number> {
    return this.remove({ permission: grant.permission.name, role: grant.role.name }, this.grants)
  }

  public async removePermission (permission: Permission): Promise<Number> {
    return this.remove({ name: permission.name }, this.permissions)
  }

  public async remove (filter: any, datastore: any): Promise<Number> {
    const index = datastore.findIndex((i: Serializable) => i.id === filter.id)
    try {
      datastore.splice(index, 1)
      return 1
    } catch (error) {
      throw new DocumentNotFoundError('MemoryAdapter', JSON.stringify(filter))
    }
  }

  /**
   * Prepares document after reading from storage engine
   * use this method to sort out ids/keys of the document for document.id compatibility
   *
   * @private
   * @param {*} document
   * @returns
   *
   * @memberOf MemoryAdapter
   */
  private deserialize (document: any) {
    return document
  }

  /**
   * Prepares document for writing into storage engine
   * use this method to sort out ids/keys of the document for document.id compatibility
   *
   * @private
   * @param {*} document
   * @returns
   *
   * @memberOf MemoryAdapter
   */
  private serialize (document: Serializable) {
    return document
  }
}
