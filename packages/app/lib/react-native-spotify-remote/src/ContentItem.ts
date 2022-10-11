export default interface ContentItem{
    /**
     * The primary title of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    title:string;
    /**
     * The secondary title of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    subtitle:string;
    /**
     * The unique identifier of the item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    id:string;
    /**
     * The playback URI of this item.
     *
     * @type {string}
     * @memberof SpotifyContentItem
     */
    uri:string;
    
    /**
     * true if the item is available offline, or if it has any child that is available offline, otherwise false.
     *
     * @type {boolean}
     * @memberof SpotifyContentItem
     */
    availableOffline:boolean;

    /**
     * Returns true if the item is directly playable, otherwise false.
     *
     * @type {boolean}
     * @memberof SpotifyContentItem
     */
    playable:boolean;

    /**
     * Returns true if the item is expected to contain children, otherwise false.
     *
     * @type {boolean}
     * @memberof SpotifyContentItem
     */
    container:boolean;

    /**
     * A list of the content item’s children.
     * 
     * *Note: This is not populated for all container items as some of them are fetched lazily.*
     * 
     * @type {ContentItem[]}
     * @memberof ContentItem
     */
    children:ContentItem[]
}