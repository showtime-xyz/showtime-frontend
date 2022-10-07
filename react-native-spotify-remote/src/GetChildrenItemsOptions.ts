import ContentType from "./ContentType";

/**
 * Options used when retrieving children items
 *
 * @export
 * @interface GetChildrenItemsOptions
 */
export default interface GetChildrenItemsOptions {
    /**
     * Number of items to return per page
     * **Android Only**
     * @type {number}
     * @memberof GetChildrenItemsOptions
     */
    perPage?: number;

    /**
     * page offset for children items
     * **Android Only** 
     * @type {number}
     * @memberof GetChildrenItemsOptions
     */
    offset?: number;
}


export const DEFAULT_GET_CHILDREN_OPTIONS: GetChildrenItemsOptions = {
    perPage: 20,
    offset: 0
}