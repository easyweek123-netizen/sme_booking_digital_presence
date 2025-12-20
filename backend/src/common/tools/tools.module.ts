import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ToolRegistry } from './tool-registry';
import { ToolDiscoveryService } from './tool-discovery.service';

/**
 * Injection token for tool handlers array (kept for backward compatibility)
 */
export const TOOL_HANDLERS = Symbol('TOOL_HANDLERS');

/**
 * Tools Module
 *
 * Provides automatic tool discovery and registration.
 * Tool handlers just need to be decorated with @ToolHandler and
 * included in any module's providers - they will be auto-discovered.
 *
 * @example
 * ```typescript
 * // In AppModule or ChatModule
 * imports: [
 *   ToolsModule,
 *   ServicesModule, // Tools in ServicesModule.providers are auto-discovered
 * ],
 * ```
 */
@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [ToolRegistry, ToolDiscoveryService],
  exports: [ToolRegistry],
})
export class ToolsModule {}
