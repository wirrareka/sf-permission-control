import { Role } from './role'
import { Grant } from './grant'
import { Permission } from './permission'

export interface DataAdapterInterface {
  connected: boolean

  getRoles (): Promise<Role[]>
  getGrants (): Promise<Grant[]>
  getPermissions (): Promise<Permission[]>
  createRole (role: Role): Promise<Role>
  createGrant (grant: Grant): Promise<Grant>
  createPermission (permission: Permission): Promise<Permission>
  updateRole (role: Role): Promise<Role>
  updateGrant (grant: Grant): Promise<Grant>
  updatePermission (permission: Permission): Promise<Permission>
  removeRole (role: Role): Promise<Number>
  removeGrant (grant: Grant): Promise<Number>
  removePermission (permission: Permission): Promise<Number>
  prepare (): Promise<DataAdapter>
  connect (): Promise<DataAdapter>
  migrate (): Promise<DataAdapter>
}

export interface DataAdapterOptions {
  type?: String
  migrate?: Boolean,
  connection?: any
  filter?: any
}

export class DataAdapter {
  options: DataAdapterOptions
  connected: boolean
  filter: any

  constructor (options: DataAdapterOptions) {
    this.options = Object.assign({
      type: 'abstract',
      migrate: true,
      connection: {}
    }, options)
    this.filter = this.options.filter || {}
    this.connected = false
  }
}
