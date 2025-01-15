import {
  ZineKernel,
  ZineApplication,
  ZineApplicationService,
  ServiceRegistry,
} from "@zine/base";

ServiceRegistry.configure<ZineApplicationService>(ZineApplication, {
  console: [],
  kernel: ZineKernel,
}).call();
