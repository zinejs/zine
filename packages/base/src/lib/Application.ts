import { ZineHttpRouter, ZineHttpRouterProxyObject } from "@zine/router";

export class ZineApplication {
  /**
   * Used to store an instance of the ZineHttpRouter.
   */
  private appRouter: ZineHttpRouterProxyObject | undefined;

  /**
   * Creates a singleton instance of the ZineHttpRouter for later use.
   * @returns {ZineHttpRouterProxyObject}
   */
  public useRouter(): ZineHttpRouterProxyObject {
    if (this.appRouter == undefined) {
      this.appRouter = ZineHttpRouter.createProxy(
        new ZineHttpRouter()
      ) as unknown as ZineHttpRouterProxyObject;
    }
    return this.appRouter!;
  }
}

