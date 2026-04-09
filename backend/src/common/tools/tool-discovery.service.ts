import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ToolRegistry } from './tool-registry';
import { isToolHandler } from './tool-handler.decorator';
import type { BaseToolHandler } from './base-tool.handler';

/**
 * Auto-discovers all @ToolHandler decorated classes and registers them.
 * 
 * Tool handlers just need to be in a module's providers array - 
 * this service will find and register them automatically.
 */
@Injectable()
export class ToolDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(ToolDiscoveryService.name);

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly registry: ToolRegistry,
  ) {}

  onModuleInit() {
    const providers = this.discovery.getProviders();

    const handlers = providers
      .filter((wrapper) => {
        const metatype = wrapper.metatype;
        return metatype && isToolHandler(metatype);
      })
      .map((wrapper) => wrapper.instance as BaseToolHandler)
      .filter(Boolean);

    if (handlers.length > 0) {
      this.registry.registerHandlers(handlers);
      this.logger.log(`Discovered and registered ${handlers.length} tool handlers`);
    } else {
      this.logger.warn('No tool handlers discovered');
    }
  }
}

