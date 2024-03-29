/* tslint:disable */
/* eslint-disable */
/**
 * OSB Workspaces manager API
 * Opensource Brain Platform - Reference Workspaces manager API
 *
 * The version of the OpenAPI document: 0.2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    ResourceStatus,
    ResourceStatusFromJSON,
    ResourceStatusFromJSONTyped,
    ResourceStatusToJSON,
    ResourceType,
    ResourceTypeFromJSON,
    ResourceTypeFromJSONTyped,
    ResourceTypeToJSON,
    WorkspaceResourceBase,
    WorkspaceResourceBaseFromJSON,
    WorkspaceResourceBaseFromJSONTyped,
    WorkspaceResourceBaseToJSON,
    WorkspaceResourceEntityAllOf,
    WorkspaceResourceEntityAllOfFromJSON,
    WorkspaceResourceEntityAllOfFromJSONTyped,
    WorkspaceResourceEntityAllOfToJSON,
} from './';

/**
 * Workspace Resource item of a Workspace
 * @export
 * @interface WorkspaceResourceEntity
 */
export interface WorkspaceResourceEntity {
    /**
     * 
     * @type {number}
     * @memberof WorkspaceResourceEntity
     */
    id?: number;
    /**
     * WorkspaceResource name
     * @type {string}
     * @memberof WorkspaceResourceEntity
     */
    name: string;
    /**
     * 
     * @type {ResourceStatus}
     * @memberof WorkspaceResourceEntity
     */
    status?: ResourceStatus;
    /**
     * Date/time of creation of the WorkspaceResource
     * @type {Date}
     * @memberof WorkspaceResourceEntity
     */
    timestampCreated?: Date;
    /**
     * Date/time of last updating of the WorkspaceResource
     * @type {Date}
     * @memberof WorkspaceResourceEntity
     */
    timestampUpdated?: Date;
    /**
     * Date/time of last opening of the WorkspaceResource
     * @type {Date}
     * @memberof WorkspaceResourceEntity
     */
    timestampLastOpened?: Date;
    /**
     * 
     * @type {ResourceType}
     * @memberof WorkspaceResourceEntity
     */
    resourceType: ResourceType;
    /**
     * WorkspaceResource path where the resource will stored in the pvc.
     * @type {string}
     * @memberof WorkspaceResourceEntity
     */
    path?: string;
    /**
     * Origin data JSON formatted of the WorkspaceResource
     * @type {string}
     * @memberof WorkspaceResourceEntity
     */
    origin?: string;
    /**
     * workspace_id
     * @type {number}
     * @memberof WorkspaceResourceEntity
     */
    workspaceId?: number;
}

export function WorkspaceResourceEntityFromJSON(json: any): WorkspaceResourceEntity {
    return WorkspaceResourceEntityFromJSONTyped(json, false);
}

export function WorkspaceResourceEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkspaceResourceEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'status': !exists(json, 'status') ? undefined : ResourceStatusFromJSON(json['status']),
        'timestampCreated': !exists(json, 'timestamp_created') ? undefined : (new Date(json['timestamp_created'])),
        'timestampUpdated': !exists(json, 'timestamp_updated') ? undefined : (new Date(json['timestamp_updated'])),
        'timestampLastOpened': !exists(json, 'timestamp_last_opened') ? undefined : (new Date(json['timestamp_last_opened'])),
        'resourceType': ResourceTypeFromJSON(json['resource_type']),
        'path': !exists(json, 'path') ? undefined : json['path'],
        'origin': !exists(json, 'origin') ? undefined : json['origin'],
        'workspaceId': !exists(json, 'workspace_id') ? undefined : json['workspace_id'],
    };
}

export function WorkspaceResourceEntityToJSON(value?: WorkspaceResourceEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'status': ResourceStatusToJSON(value.status),
        'timestamp_created': value.timestampCreated === undefined ? undefined : (value.timestampCreated.toISOString()),
        'timestamp_updated': value.timestampUpdated === undefined ? undefined : (value.timestampUpdated.toISOString()),
        'timestamp_last_opened': value.timestampLastOpened === undefined ? undefined : (value.timestampLastOpened.toISOString()),
        'resource_type': ResourceTypeToJSON(value.resourceType),
        'path': value.path,
        'origin': value.origin,
        'workspace_id': value.workspaceId,
    };
}


