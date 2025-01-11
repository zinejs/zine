import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { BlankEnv, BlankSchema, Handler } from "hono/types";

const honoMethods = ["get", "post", "put", "patch", "delete", "all"] as const;
type HonoMethods = {
  [K in (typeof honoMethods)[number]]: Hono<BlankEnv, BlankSchema, "/">[K];
};

export type ZineHttpRouterProxyObject = ZineHttpRouter & HonoMethods;

export class ZineHttpRouter {
  private honoRouter: Hono<BlankEnv, BlankSchema, "/"> | undefined;

  public constructor() {
    this.honoRouter = new Hono();
  }

  public listen(PORT: number) {
    serve({
      fetch: this.honoRouter!.fetch,
      port: PORT
    }, () => console.log(`Server Listening on PORT: ${PORT}`));
  }

  private __call(fn: string, args: unknown[]) {
    if (this.honoRouter) {
      // Type guard to ensure honoRouter is defined
      if (honoMethods.includes(fn as any)) {
        (
          this.honoRouter[fn as keyof Hono<BlankEnv, BlankSchema, "/">] as (
            ...args: any[]
          ) => any
        )(...args);
      }
    }
  }

  public static createProxy<T extends ZineHttpRouter>(
    target: T
  ): T & keyof typeof honoMethods {
    return new Proxy<T>(target, {
      get: (target: T, property: string | symbol, receiver: any) => {
        if (
          typeof property === "string" &&
          honoMethods.includes(property as any)
        ) {
          return ((...args) => {
            return target.__call(property, args);
          }) as Handler;
        }

        return Reflect.get(target, property, receiver);
      },
    }) as T & keyof typeof honoMethods;
  }
}
