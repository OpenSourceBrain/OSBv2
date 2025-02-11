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
    RepositoryResourceBase,
    RepositoryResourceBaseFromJSON,
    RepositoryResourceBaseFromJSONTyped,
    RepositoryResourceBaseToJSON,
} from './';

/**
 * figshare repository resource
 * @export
 * @interface BiomodelsRepositoryResource
 */
export interface BiomodelsRepositoryResource {
    /**
     * file name
     * @type {string}
     * @memberof BiomodelsRepositoryResource
     */
    name?: string;
    /**
     * Download URL of the Resource
     * @type {string}
     * @memberof BiomodelsRepositoryResource
     */
    path?: string;
    /**
     * OSB Repository id
     * @type {number}
     * @memberof BiomodelsRepositoryResource
     */
    osbrepositoryId?: number;
    /**
     * File size in bytes of the RepositoryResource
     * @type {number}
     * @memberof BiomodelsRepositoryResource
     */
    size?: number;
    /**
     * Date/time the ReposityResource is last modified
     * @type {Date}
     * @memberof BiomodelsRepositoryResource
     */
    timestampModified?: Date;
}

export function BiomodelsRepositoryResourceFromJSON(json: any): BiomodelsRepositoryResource {
    return BiomodelsRepositoryResourceFromJSONTyped(json, false);
}

export function BiomodelsRepositoryResourceFromJSONTyped(json: any, ignoreDiscriminator: boolean): BiomodelsRepositoryResource {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'path': !exists(json, 'path') ? undefined : json['path'],
        'osbrepositoryId': !exists(json, 'osbrepository_id') ? undefined : json['osbrepository_id'],
        'size': !exists(json, 'size') ? undefined : json['size'],
        'timestampModified': !exists(json, 'timestamp_modified') ? undefined : (new Date(json['timestamp_modified'])),
    };
}

export function BiomodelsRepositoryResourceToJSON(value?: BiomodelsRepositoryResource | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'path': value.path,
        'osbrepository_id': value.osbrepositoryId,
        'size': value.size,
        'timestamp_modified': value.timestampModified === undefined ? undefined : (value.timestampModified.toISOString()),
    };
}


