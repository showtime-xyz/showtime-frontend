import ContentType from "./ContentType";

export default interface RecommendedContentOptions {
    /**
     * The type of RecomendedItems to fetch.  Can be *default*, *fitness*, *navigation*
     *
     * @type {string}
     * @memberof RecommendedContentOptions
     */
    type?: ContentType;

    /**
     * Flattens the returned content item containers into a single list
     *
     * @type {boolean}
     * @memberof RecommendedContentOptions
     */
    flatten?: boolean;
}
