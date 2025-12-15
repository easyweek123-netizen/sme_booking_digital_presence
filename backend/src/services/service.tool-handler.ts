import { Injectable } from '@nestjs/common';
import { ToolHandler, ToolResult, ToolDefinition } from '../common';
import { ServicesService } from './services.service';
import { BusinessService } from '../business/business.service';

/**
 * Arguments for manage_service tool
 */
interface ManageServiceArgs {
  operation: 'get' | 'create' | 'update' | 'delete';
  serviceId?: number;
  name?: string;
  price?: number;
  durationMinutes?: number;
  description?: string;
}

@Injectable()
export class ServiceToolHandler implements ToolHandler {
  readonly toolName = 'manage_service';

  constructor(
    private servicesService: ServicesService,
    private businessService: BusinessService,
  ) {}

  /**
   * Tool definition for OpenAI function calling
   */
  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description:
          'Manage services for the business - get list, create new, update existing, or delete',
        parameters: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['get', 'create', 'update', 'delete'],
              description: 'The operation to perform',
            },
            serviceId: {
              type: 'number',
              description:
                'Service ID (required for update/delete, optional for get specific)',
            },
            name: {
              type: 'string',
              description: 'Service name (for create/update)',
            },
            price: {
              type: 'number',
              description: 'Price in dollars (for create/update)',
            },
            durationMinutes: {
              type: 'number',
              description: 'Duration in minutes (for create/update)',
            },
            description: {
              type: 'string',
              description: 'Service description (optional)',
            },
          },
          required: ['operation'],
        },
      },
    };
  }

  /**
   * Handle the tool call
   */
  async handle(
    args: Record<string, unknown>,
    ownerId: number,
  ): Promise<ToolResult> {
    // Resolve business ONCE for all operations
    const business = await this.businessService.findByOwnerId(ownerId);
    if (!business) {
      return { success: false, error: 'No business found for this owner' };
    }

    const operation = args.operation as ManageServiceArgs['operation'];
    const serviceId = args.serviceId as number | undefined;
    const name = args.name as string | undefined;
    const price = args.price as number | undefined;
    const durationMinutes = args.durationMinutes as number | undefined;
    const description = args.description as string | undefined;

    switch (operation) {
      case 'get':
        return this.handleGet(business.id, serviceId);
      case 'create':
        return this.handleCreate(business.id, { name, price, durationMinutes, description });
      case 'update':
        return this.handleUpdate(business.id, serviceId, { name, price, durationMinutes, description });
      case 'delete':
        return this.handleDelete(business.id, serviceId);
      default:
        return { success: false, error: `Unknown operation: ${operation}` };
    }
  }

  /**
   * Get service owned by business, or null if not found/not owned
   */
  private async getOwnedService(
    serviceId: number,
    businessId: number,
  ) {
    try {
      const service = await this.servicesService.findOne(serviceId);
      if (service.businessId !== businessId) return null;
      return service;
    } catch {
      return null;
    }
  }

  /**
   * Get services - all or specific
   */
  private async handleGet(
    businessId: number,
    serviceId?: number,
  ): Promise<ToolResult> {
    if (serviceId) {
      // Get specific service
      const service = await this.getOwnedService(serviceId, businessId);
      if (!service) {
        return { success: false, error: 'Service not found' };
      }
      return {
        success: true,
        data: {
          operation: 'get',
          service: {
            id: service.id,
            name: service.name,
            price: Number(service.price),
            durationMinutes: service.durationMinutes,
            description: service.description,
          },
        },
      };
    }

    // Get all services
    const services = await this.servicesService.findByBusiness(businessId);
    return {
      success: true,
      data: {
        operation: 'get',
        services: services.map((s) => ({
          id: s.id,
          name: s.name,
          price: Number(s.price),
          durationMinutes: s.durationMinutes,
          description: s.description,
        })),
      },
    };
  }

  /**
   * Prepare data for creating a service
   * Returns the data for FE to display a form
   */
  private async handleCreate(
    businessId: number,
    data: Partial<ManageServiceArgs>,
  ): Promise<ToolResult> {
    // Validate required fields
    if (!data.name) {
      return { success: false, error: 'Service name is required' };
    }
    if (data.price === undefined || data.price === null) {
      return { success: false, error: 'Price is required' };
    }
    if (!data.durationMinutes) {
      return { success: false, error: 'Duration is required' };
    }

    // Return prepared data for FE form
    return {
      success: true,
      data: {
        operation: 'create',
        businessId,
        service: {
          name: data.name,
          price: data.price,
          durationMinutes: data.durationMinutes,
          description: data.description || '',
        },
      },
    };
  }

  /**
   * Prepare data for updating a service
   */
  private async handleUpdate(
    businessId: number,
    serviceId: number | undefined,
    data: Partial<ManageServiceArgs>,
  ): Promise<ToolResult> {
    if (!serviceId) {
      return { success: false, error: 'Service ID is required for update' };
    }

    const service = await this.getOwnedService(serviceId, businessId);
    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    // Return prepared data with existing values merged with updates
    return {
      success: true,
      data: {
        operation: 'update',
        serviceId,
        service: {
          name: data.name ?? service.name,
          price: data.price ?? Number(service.price),
          durationMinutes: data.durationMinutes ?? service.durationMinutes,
          description: data.description ?? service.description ?? '',
        },
      },
    };
  }

  /**
   * Prepare data for deleting a service
   */
  private async handleDelete(
    businessId: number,
    serviceId: number | undefined,
  ): Promise<ToolResult> {
    if (!serviceId) {
      return { success: false, error: 'Service ID is required for delete' };
    }

    const service = await this.getOwnedService(serviceId, businessId);
    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    return {
      success: true,
      data: {
        operation: 'delete',
        serviceId,
        service: {
          id: service.id,
          name: service.name,
        },
      },
    };
  }
}

