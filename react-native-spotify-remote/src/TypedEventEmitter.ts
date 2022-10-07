/**
 * An EventEmitter that supports events given by the interface in {T}
 * Where each Key represents the eventName and the type represents the payload
 * This interface is based on the implementation here: https://github.com/Gozala/events/blob/master/events.js
 * 
 * @export
 * @interface TypedEventEmitter
 * @template T
 */
export default interface TypedEventEmitter<T> {
    on<K extends keyof T>(name: K, listener: (v: T[K]) => void): this;
    addListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    once<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    prependListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    prependOnceListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    removeListener<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    off<K extends keyof T>(event: K, listener: (v: T[K]) => void): this;
    removeAllListeners<K extends keyof T>(event?: K): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners<K extends keyof T>(event: K): (v: T[K]) => void[];
    rawListeners<K extends keyof T>(event: K): (v: T[K]) => void[];
    emit<K extends keyof T>(event: K, args: T[K]): boolean;
    eventNames<K extends keyof T>(): Array<K>;
    listenerCount<K extends keyof T>(type: K): number;
}