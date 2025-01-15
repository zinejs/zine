import { ZineKernel } from "@/lib/ZineKernel";
import { ServiceRegistry } from "@/lib/ServiceRegistry";
import { AbstractServiceProvider } from "@/lib/AbstractServiceProvider";
import { ZineHttpRouter, ZineHttpRouterProxyObject } from "@zine/router";

/**
 * @typedef ZineApplicationService
 * @description Defines the structure of the Zine application service configuration.
 * @property {ZineKernel} kernel - The Zine kernel instance.
 * @property {AbstractServiceProvider[]} console - An array of console service providers.
 */
export type ZineApplicationService = {
  kernel: ZineKernel;
  console: AbstractServiceProvider[];
};

/**
 * @class ZineApplication
 * @description Represents the main Zine application class.
 * This class is responsible for initializing the application and providing access to core services, such as the router.
 */
export class ZineApplication {
  /**
   * @private
   * @property appRouter
   * @description Stores a singleton instance of the ZineHttpRouter proxy object.
   * This ensures that only one router instance is created for the application.
   */
  private appRouter: ZineHttpRouterProxyObject | undefined;

  /**
   * @constructor
   * @description Initializes the Zine application.
   * Retrieves the application configuration from the ServiceRegistry.
   * Logs the configuration to the console.
   */
  public constructor() {
    const configuration =
      ServiceRegistry.get<ZineApplicationService>(ZineApplication);

    console.log(configuration);
  }

  /**
   * @method useRouter
   * @description Creates and returns a singleton instance of the ZineHttpRouter proxy object.
   * This method ensures that only one router instance is ever created for the application, making it accessible application-wide.
   * @returns {ZineHttpRouterProxyObject} The singleton instance of the ZineHttpRouter proxy object.
   */
  public useRouter(): ZineHttpRouterProxyObject {
    /**
     * @description Checks if an instance of the router has already been created.
     * If not, it creates a new instance and its proxy.
     */
    if (this.appRouter == undefined) {
      /**
       * @description Creates a new instance of the ZineHttpRouter and wraps it with a proxy.
       * The proxy enhances the router with additional features (e.g., middleware support).
       * The double casting is used to satisfy Typescript.
       */
      this.appRouter = ZineHttpRouter.createProxy(
        new ZineHttpRouter()
      ) as unknown as ZineHttpRouterProxyObject;
    }
    /**
     * @description Returns the singleton instance of the router.
     * The `!` non-null assertion operator is used because we know `this.appRouter` is now defined within the if block.
     */
    return this.appRouter!;
  }
}
