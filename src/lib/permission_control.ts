import { RoleIdentity } from './role_identity'
import {
  InvalidPermissionError,
  InvalidAttributeTypeError,
  InvalidRoleError,
  RoleNotFoundError,
  PermissionNotFoundError
} from './errors'
import { DataAdapterInterface } from './data_adapter'
import { Permission } from './permission'
import { Role } from './role'
import { Grant } from './grant'

const grantMaps = new WeakMap()
const permissionMaps = new WeakMap()
const roleMaps = new WeakMap()

export class PermissionControl {
  adapter: DataAdapterInterface

  constructor (adapter: DataAdapterInterface) {
    this.adapter = adapter
  }

  can (role: string | Role | RoleIdentity, permission: string | Permission) {

    let roleKey: string | null = null
    let permissionKey: string | null = null

    if ((typeof role !== 'string') &&
        !(role instanceof Role) &&
        !(typeof (role as any) === 'object' && typeof (role as any)['role'] !== 'undefined')) {
      throw new InvalidAttributeTypeError('role')
    }

    if (typeof role === 'string') {
      roleKey = role
    }

    if (role instanceof Role) {
      roleKey = role.name
    }

    // RoleIdentity
    if (typeof role === 'object' && typeof (role as any).role !== 'undefined') {
      roleKey = (role as any).role
    }

    if (roleKey === null || roleKey.length === 0) {
      throw new InvalidRoleError(roleKey)
    }

    if (typeof permission !== 'string' && !(permission instanceof Permission)) {
      throw(new InvalidAttributeTypeError('permission'))
    }

    if (typeof role === 'string') {
      permissionKey = permission as string
    }

    if (permission instanceof Permission) {
      permissionKey = permission.name
    }

    if (permissionKey === null || permissionKey.length === 0) {
      throw new InvalidPermissionError(permissionKey)
    }

    if (!this.permissions.has(permissionKey)) {
      throw new PermissionNotFoundError(permissionKey)
    }

    if (!this.roles.has(roleKey)) {
      throw new RoleNotFoundError(roleKey)
    }

    const rolePermissions = this.grantMap.get(roleKey) || new Set()
    return rolePermissions.has(permissionKey)
  }

  private get permissions (): Set<string> {
    return permissionMaps.get(this)
  }

  private get roles (): Set<string> {
    return roleMaps.get(this)
  }

  private get grantMap (): Map<string, Set<string>> {
    return grantMaps.get(this)
  }

  public async load (): Promise<void> {
    const permissions = await this.adapter.getPermissions()
    const roles = await this.adapter.getRoles()
    const grants = await this.adapter.getGrants()
    await this.update(permissions, roles, grants)
    return
  }

  private async update (permissions: Permission[], roles: Role[], grants: Grant[]): Promise<void> {
    permissionMaps.set(this, new Set(permissions.map(p => p.name)))
    roleMaps.set(this, new Set(roles.map(r => r.name)))
    const grantMap = new Map()
    grants.forEach((grant) => {
      const roleKey = grant.role.name
      const permissions = grantMap.get(roleKey)
      if (!permissions) {
        grantMap.set(roleKey, new Set([grant.permission.name]))
      } else {
        permissions.add(grant.permission.name)
      }
    })
    grantMaps.set(this, grantMap)
  }

}
