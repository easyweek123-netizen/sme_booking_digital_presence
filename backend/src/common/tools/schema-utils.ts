import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ZodObject, ZodRawShape } from 'zod';

/**
 * OpenAI function parameter schema structure
 */
export interface OpenAIParameters {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

/**
 * Convert a Zod object schema to OpenAI function parameters format.
 * Uses zod-to-json-schema and strips unnecessary properties.
 */
export function zodToOpenAISchema<T extends ZodRawShape>(
  schema: ZodObject<T>,
): OpenAIParameters {
  const jsonSchema = zodToJsonSchema(schema, {
    $refStrategy: 'none', // Inline all definitions
  }) as Record<string, unknown>;

  // Extract only what OpenAI needs
  return {
    type: 'object',
    properties: (jsonSchema.properties as Record<string, unknown>) ?? {},
    required: jsonSchema.required as string[] | undefined,
  };
}
