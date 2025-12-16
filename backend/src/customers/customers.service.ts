import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { firebaseUid } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }

  /**
   * Find or create a customer based on Firebase UID
   * Used during booking verification flow
   */
  async findOrCreate(
    firebaseUid: string,
    data: { name: string; email?: string },
  ): Promise<Customer> {
    // Try to find existing customer
    let customer = await this.findByFirebaseUid(firebaseUid);

    if (!customer) {
      // Create new customer
      customer = await this.create({
        firebaseUid,
        name: data.name,
        email: data.email,
      });
    } else {
      // Update customer info if provided
      const updates: UpdateCustomerDto = {};
      if (data.name && data.name !== customer.name) {
        updates.name = data.name;
      }
      if (data.email && data.email !== customer.email) {
        updates.email = data.email;
      }

      if (Object.keys(updates).length > 0) {
        const updated = await this.update(customer.id, updates);
        if (updated) {
          customer = updated;
        }
      }
    }

    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer | null> {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }

  /**
   * Find all customers for a business owner (customers who have booked with any of owner's businesses)
   */
  async findAllForOwner(ownerId: number): Promise<Customer[]> {
    const customers = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.bookings', 'booking')
      .leftJoinAndSelect('booking.business', 'business')
      .where('business.ownerId = :ownerId', { ownerId })
      .orderBy('customer.name', 'ASC')
      .getMany();

    return customers;
  }

  /**
   * Find one customer with bookings for an owner
   */
  async findOneForOwner(id: number, ownerId: number): Promise<Customer> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.bookings', 'booking')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.business', 'business')
      .where('customer.id = :id', { id })
      .andWhere('business.ownerId = :ownerId', { ownerId })
      .orderBy('booking.date', 'DESC')
      .addOrderBy('booking.startTime', 'DESC')
      .getOne();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
