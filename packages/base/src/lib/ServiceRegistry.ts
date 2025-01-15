/**
 * @class ServiceRegistry
 * @description A registry for managing service configurations and instantiations.
 * This class allows associating configuration data with service constructors
 * and retrieving configured instances.
 */
export class ServiceRegistry {
  /**
   * @private
   * @property instance
   * @description The constructor function of the service to be instantiated.
   */
  private instance: Function | undefined;

  /**
   * @private
   * @static
   * @property configuration
   * @description A map storing service constructors and their associated configurations.
   */
  private static configuration: Map<Function, unknown> = new Map();

  /**
   * @constructor
   * @param instance The constructor function of the service.
   * @throws {Error} If the provided instance is not a function.
   */
  public constructor(instance: Function) {
    if (typeof instance !== "function") {
      throw new Error(
        "ServiceRegistry constructor requires a constructor function."
      );
    }
    this.instance = instance;
  }

  /**
   * @method call
   * @description Creates a new instance of the registered service.
   * @returns {T} A new instance of the registered service.
   * @throws {Error} If no instance is registered.
   */
  public call<T>(): T {
    if (!this.instance) {
      throw new Error("No instance registered. Call configure first.");
    }
    return new (this.instance as any)() as T;
  }

  /**
   * @method configure
   * @static
   * @description Registers a service constructor with its configuration.
   * @param {Function} type The constructor function of the service.
   * @param {T} config The configuration object for the service.
   * @returns {ServiceRegistry} A new ServiceRegistry instance for the configured service.
   */
  public static configure<T>(type: Function, config: T): ServiceRegistry {
    this.configuration.set(type, config);
    return new this(type);
  }

  /**
   * @method get
   * @static
   * @description Retrieves the configuration associated with a service constructor.
   * @param {Function} type The constructor function of the service.
   * @returns {T | undefined} The configuration object, or undefined if not found.
   */
  public static get<T>(type: Function): T | undefined {
    return this.configuration.get(type) as T | undefined;
  }
}
