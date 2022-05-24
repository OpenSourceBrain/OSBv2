/* tslint:disable */
/* eslint-disable */
/**
 * Workspaces manager API
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
/**
 * 
 * @export
 * @interface Pagination
 */
export interface Pagination {
    /**
     * 
     * @type {number}
     * @memberof Pagination
     */
    currentPage?: number;
    /**
     * 
     * @type {number}
     * @memberof Pagination
     */
    numberOfPages?: number;
    /**
     * 
     * @type {number}
     * @memberof Pagination
     */
    total?: number;
}

export function PaginationFromJSON(json: any): Pagination {
    return PaginationFromJSONTyped(json, false);
}

export function PaginationFromJSONTyped(json: any, ignoreDiscriminator: boolean): Pagination {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'currentPage': !exists(json, 'current_page') ? undefined : json['current_page'],
        'numberOfPages': !exists(json, 'number_of_pages') ? undefined : json['number_of_pages'],
        'total': !exists(json, 'total') ? undefined : json['total'],
    };
}

export function PaginationToJSON(value?: Pagination | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'current_page': value.currentPage,
        'number_of_pages': value.numberOfPages,
        'total': value.total,
    };
}

