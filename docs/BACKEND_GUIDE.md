# BookEasy Backend Coding Guide

This guide defines the coding standards and patterns for the BookEasy NestJS backend. All contributors and AI agents must follow these conventions.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Module Organization](#module-organization)
3. [Service Patterns](#service-patterns)
4. [Controller Patterns](#controller-patterns)
5. [DTOs and Validation](#dtos-and-validation)
6. [TypeORM Patterns](#typeorm-patterns)
7. [Authentication](#authentication)
8. [Error Handling](#error-handling)
9. [Configuration](#configuration)
10. [TypeScript Guidelines](#typescript-guidelines)
11. [Naming Conventions](#naming-conventions)
12. [DRY Principles](#dry-principles)
13. [Testing](#testing)

---

## Project Structure

```
backend/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── app.controller.ts          # Health check endpoint
├── config/                    # Configuration modules
│   ├── index.ts               # Export all configs
│   ├── configuration.ts       # General config
│   ├── app.config.ts          # App-specific config
│   ├── database.config.ts     # Database config
│   └── jwt.config.ts          # JWT config
├── database/                  # Database setup
│   ├── database.module.ts     # TypeORM module
│   ├── data-source.ts         # TypeORM data source (for CLI)
│   └── seeds/                 # Seed scripts
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── owner/                     # Owner/User module
├── business/                  # Business module
├── services/                  # Business services module
├── bookings/                  # Bookings module
└── business-categories/       # Categories module
```

### File Placement Rules

| Type | Location | Example |
|------|----------|---------|
| Module | `{domain}/{domain}.module.ts` | `auth/auth.module.ts` |
| Service | `{domain}/{domain}.service.ts` | `auth/auth.service.ts` |
| Controller | `{domain}/{domain}.controller.ts` | `auth/auth.controller.ts` |
| Entity | `{domain}/entities/{entity}.entity.ts` | `owner/entities/owner.entity.ts` |
| DTO | `{domain}/dto/{action}.dto.ts` | `auth/dto/register.dto.ts` |
| Guard | `{domain}/guards/{guard}.guard.ts` | `auth/guards/jwt-auth.guard.ts` |
| Strategy | `{domain}/strategies/{strategy}.strategy.ts` | `auth/strategies/jwt.strategy.ts` |

---

## Module Organization

### Standard Module Structure

```typescript
// ✅ Good - clean module with clear imports/exports
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]),
    // Other required modules
  ],
  controllers: [DomainController],
  providers: [DomainService],
  exports: [DomainService], // Only export what other modules need
})
export class DomainModule {}
```

### Index Files for Exports

Create index files in subdirectories for clean imports:

```typescript
// auth/dto/index.ts
export { RegisterDto } from './register.dto';
export { LoginDto } from './login.dto';

// auth/guards/index.ts
export { JwtAuthGuard } from './jwt-auth.guard';
```

```typescript
// Usage - clean single import
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards';
```

---

## Service Patterns

### Repository Injection

```typescript
// ✅ Good - inject repository via constructor
@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}
}
```

### Method Design - Avoid Duplication

```typescript
// ❌ Bad - duplicate methods doing the same thing
async findOne(id: number): Promise<Owner | null> {
  return this.ownerRepository.findOne({ where: { id } });
}

async findById(id: number): Promise<Owner | null> {  // DUPLICATE!
  return this.ownerRepository.findOne({ where: { id } });
}

// ✅ Good - single method, clear purpose
async findOne(id: number): Promise<Owner | null> {
  return this.ownerRepository.findOne({ where: { id } });
}

async findByEmail(email: string): Promise<Owner | null> {
  return this.ownerRepository.findOne({ where: { email } });
}
```

### Return Types

Always use explicit return types with `Promise`:

```typescript
// ✅ Good - explicit return types
async create(dto: CreateOwnerDto): Promise<Owner> {
  const owner = this.ownerRepository.create(dto);
  return this.ownerRepository.save(owner);
}

async findOne(id: number): Promise<Owner | null> {
  return this.ownerRepository.findOne({ where: { id } });
}

// ❌ Bad - missing return type
async findOne(id: number) {
  return this.ownerRepository.findOne({ where: { id } });
}
```

### Service Method Naming

| Action | Pattern | Example |
|--------|---------|---------|
| Create | `create(dto)` | `create(createOwnerDto)` |
| Find one | `findOne(id)` | `findOne(1)` |
| Find by field | `findBy{Field}(value)` | `findByEmail(email)` |
| Find all | `findAll()` | `findAll()` |
| Update | `update(id, dto)` | `update(1, updateOwnerDto)` |
| Delete | `remove(id)` | `remove(1)` |

---

## Controller Patterns

### HTTP Decorators

```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)  // 201 for creation
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)  // 200 for successful action
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)  // Protected route
  async getMe(@Request() req: RequestWithUser) {
    return req.user;
  }
}
```

### Request Typing

```typescript
// Define typed request interface
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Use in controller
@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@Request() req: RequestWithUser) {
  return req.user;
}
```

### Response Consistency

Define response interfaces for complex returns:

```typescript
// auth.service.ts
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}
```

---

## DTOs and Validation

### DTO Structure

```typescript
// ✅ Good - clear validation with messages
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(100)
  name: string;
}
```

### Validation Decorators

| Decorator | Use Case |
|-----------|----------|
| `@IsString()` | String fields |
| `@IsNumber()` | Numeric fields |
| `@IsEmail()` | Email validation |
| `@IsOptional()` | Optional fields |
| `@MinLength(n)` | Minimum string length |
| `@MaxLength(n)` | Maximum string length |
| `@Min(n)` | Minimum number value |
| `@Max(n)` | Maximum number value |
| `@IsEnum(Enum)` | Enum values |
| `@IsArray()` | Array fields |
| `@ValidateNested()` | Nested objects |

### Global Validation Pipe

Already configured in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,        // Strip unknown properties
    forbidNonWhitelisted: true,  // Throw on unknown properties
    transform: true,        // Auto-transform payloads
  }),
);
```

---

## TypeORM Patterns

### Entity Definition

```typescript
@Entity('owners')  // Explicit table name
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null;

  @OneToMany(() => Business, (business) => business.owner)
  businesses: Business[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### Repository Methods

```typescript
// Find one
this.repo.findOne({ where: { id } });

// Find with relations
this.repo.findOne({ 
  where: { id },
  relations: ['businesses', 'businesses.services'],
});

// Find all with conditions
this.repo.find({ 
  where: { isActive: true },
  order: { createdAt: 'DESC' },
});

// Create and save
const entity = this.repo.create(dto);
return this.repo.save(entity);

// Update
await this.repo.update(id, dto);

// Delete
await this.repo.delete(id);
```

### Transactions

```typescript
// Use QueryRunner for transactions
async createBusinessWithServices(dto: CreateBusinessDto): Promise<Business> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const business = await queryRunner.manager.save(Business, businessData);
    
    for (const serviceDto of dto.services) {
      await queryRunner.manager.save(Service, {
        ...serviceDto,
        business,
      });
    }

    await queryRunner.commitTransaction();
    return business;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

---

## Authentication

### JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secret = configService.get<string>('jwt.secret');
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateOwner(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, name: user.name };
  }
}
```

### Password Hashing

```typescript
import * as bcrypt from 'bcrypt';

// Hash password
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### Protecting Routes

```typescript
// Single route
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req: RequestWithUser) {
  return req.user;
}

// Entire controller
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  // All routes protected
}
```

---

## Error Handling

### Built-in Exceptions

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

// Not found
throw new NotFoundException('Business not found');

// Validation error
throw new BadRequestException('Invalid date format');

// Auth error
throw new UnauthorizedException('Invalid credentials');

// Duplicate
throw new ConflictException('Email already registered');

// Permission denied
throw new ForbiddenException('You do not own this business');
```

### Service Error Pattern

```typescript
async login(dto: LoginDto): Promise<AuthResponse> {
  const owner = await this.ownerService.findByEmail(dto.email);
  
  if (!owner) {
    throw new UnauthorizedException('Invalid credentials');
  }

  if (!owner.passwordHash) {
    throw new UnauthorizedException(
      'This account uses Google sign-in. Please login with Google.',
    );
  }

  const isValid = await bcrypt.compare(dto.password, owner.passwordHash);
  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return this.generateAuthResponse(owner);
}
```

---

## Configuration

### Config Registration

```typescript
// config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
```

### Using ConfigService

```typescript
// ✅ Good - type-safe config access
@Injectable()
export class AuthModule {
  constructor(private configService: ConfigService) {}
  
  getJwtSecret(): string {
    const secret = this.configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return secret;
  }
}
```

### Config Index Export

```typescript
// config/index.ts
export { default as configuration } from './configuration';
export { default as databaseConfig } from './database.config';
export { default as appConfig } from './app.config';
export { default as jwtConfig } from './jwt.config';
```

---

## TypeScript Guidelines

### Interface Naming

```typescript
// DTO: {Action}{Entity}Dto
interface CreateOwnerDto { ... }
interface UpdateBusinessDto { ... }

// Response: {Entity}Response or {Action}Response
interface AuthResponse { ... }
interface BusinessListResponse { ... }

// Payload: {Context}Payload
interface JwtPayload { ... }

// Request extensions: RequestWith{Context}
interface RequestWithUser extends Request { ... }
```

### Type Exports

```typescript
// Export from service file for related types
// auth.service.ts
export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthResponse {
  user: { id: number; email: string; name: string };
  token: string;
}

@Injectable()
export class AuthService { ... }
```

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| Module | kebab-case | `business-categories/` |
| Entity | kebab-case.entity.ts | `owner.entity.ts` |
| DTO | kebab-case.dto.ts | `create-owner.dto.ts` |
| Service | kebab-case.service.ts | `auth.service.ts` |
| Controller | kebab-case.controller.ts | `auth.controller.ts` |
| Guard | kebab-case.guard.ts | `jwt-auth.guard.ts` |
| Strategy | kebab-case.strategy.ts | `jwt.strategy.ts` |

### Class Names

| Type | Convention | Example |
|------|------------|---------|
| Module | PascalCase + Module | `AuthModule` |
| Service | PascalCase + Service | `AuthService` |
| Controller | PascalCase + Controller | `AuthController` |
| Entity | PascalCase | `Owner`, `Business` |
| DTO | PascalCase + Dto | `CreateOwnerDto` |
| Guard | PascalCase + Guard | `JwtAuthGuard` |
| Strategy | PascalCase + Strategy | `JwtStrategy` |

### API Routes

| Convention | Example |
|------------|---------|
| Plural nouns | `/api/businesses`, `/api/bookings` |
| Kebab-case | `/api/business-categories` |
| RESTful verbs via HTTP methods | `GET /businesses`, `POST /businesses` |
| Nested resources | `/api/businesses/:id/services` |

---

## DRY Principles

### Before Creating New Code

1. **Check for existing services** - Is there already a method that does this?
2. **Check for existing DTOs** - Can you extend an existing DTO?
3. **Check for existing guards** - Use `JwtAuthGuard` from `auth/guards`
4. **Check for existing types** - Export and reuse interfaces

### Common Reusable Elements

| Element | Location | Usage |
|---------|----------|-------|
| JWT Guard | `auth/guards/jwt-auth.guard.ts` | `@UseGuards(JwtAuthGuard)` |
| JWT Payload | `auth/auth.service.ts` | Import `JwtPayload` |
| Auth Response | `auth/auth.service.ts` | Import `AuthResponse` |
| Owner Service | `owner/owner.service.ts` | Inject for user operations |

### Anti-Patterns to Avoid

```typescript
// ❌ Bad - duplicate logic in multiple services
class BusinessService {
  async findOwner(id: number) {
    return this.ownerRepo.findOne({ where: { id } });
  }
}

class BookingService {
  async getOwner(id: number) {
    return this.ownerRepo.findOne({ where: { id } });
  }
}

// ✅ Good - inject OwnerService where needed
class BusinessService {
  constructor(private ownerService: OwnerService) {}
  
  async getOwner(id: number) {
    return this.ownerService.findOne(id);
  }
}
```

```typescript
// ❌ Bad - hardcoded values
const token = this.jwtService.sign(payload, { expiresIn: '7d' });

// ✅ Good - use config
const expiresIn = this.configService.get<string>('jwt.expiresIn');
const token = this.jwtService.sign(payload, { expiresIn });
```

---

## Testing

### Unit Test Structure

```typescript
// owner.service.spec.ts
describe('OwnerService', () => {
  let service: OwnerService;
  let repository: Repository<Owner>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(Owner),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OwnerService>(OwnerService);
    repository = module.get<Repository<Owner>>(getRepositoryToken(Owner));
  });

  describe('findByEmail', () => {
    it('should return owner when found', async () => {
      const mockOwner = { id: 1, email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockOwner as Owner);

      const result = await service.findByEmail('test@example.com');
      
      expect(result).toEqual(mockOwner);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });
});
```

### E2E Test Structure

```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test' })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('test@example.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## Quick Reference

### Import Order

1. NestJS core (`@nestjs/common`, `@nestjs/config`)
2. NestJS platform (`@nestjs/platform-express`)
3. TypeORM (`@nestjs/typeorm`, `typeorm`)
4. External packages (`bcrypt`, `passport`)
5. Local modules (services, guards, DTOs)
6. Local types and interfaces

### Service Method Checklist

- [ ] Explicit return type with `Promise<T>`
- [ ] No duplicate methods (check existing before creating)
- [ ] Uses repository injection
- [ ] Throws appropriate exceptions
- [ ] Method name follows naming convention

### Controller Method Checklist

- [ ] Correct HTTP decorator (`@Get`, `@Post`, etc.)
- [ ] Explicit `@HttpCode` when not using default
- [ ] `@UseGuards(JwtAuthGuard)` for protected routes
- [ ] DTO validation on `@Body()`
- [ ] Typed `@Request()` parameter

