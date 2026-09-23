import { PrismaClient, UserRole, CasketMaterial, CasketSize, InventoryStatus, HearseStatus, ServiceType, BookingStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial funeral home data...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'director@fhms.com' },
    update: {},
    create: {
      email: 'director@fhms.com',
      passwordHash,
      firstName: 'Arthur',
      lastName: 'Pendleton',
      role: UserRole.ADMIN,
      phone: '555-0199',
    },
  });

  // 2. Create Caskets & Stock
  await prisma.casketCatalog.create({
    data: {
      sku: 'CK-OAK-001',
      name: 'Heritage Solid Oak',
      description: 'Handcrafted solid oak with satin finish and ivory velvet interior.',
      material: CasketMaterial.SOLID_WOOD,
      size: CasketSize.STANDARD,
      finish: 'Satin Oak',
      interiorType: 'Ivory Velvet',
      wholesalePrice: 1800.00,
      retailPrice: 3200.00,
      minimumStockLevel: 2,
      reorderPoint: 3,
      inventory: {
        create: [
          { serialNumber: 'SN-OAK-1001', status: InventoryStatus.IN_STOCK, storageLocation: 'Bay A-1' },
          { serialNumber: 'SN-OAK-1002', status: InventoryStatus.IN_STOCK, storageLocation: 'Bay A-2' },
          { serialNumber: 'SN-OAK-1003', status: InventoryStatus.IN_STOCK, storageLocation: 'Bay A-3' }
        ]
      }
    }
  });

  await prisma.casketCatalog.create({
    data: {
      sku: 'CK-STL-002',
      name: 'Serenity 18-Gauge Steel',
      description: 'Gasketed protection with brushed silver finish.',
      material: CasketMaterial.METAL_STEEL,
      size: CasketSize.STANDARD,
      finish: 'Brushed Silver',
      interiorType: 'White Crepe',
      wholesalePrice: 1200.00,
      retailPrice: 2400.00,
      minimumStockLevel: 2,
      reorderPoint: 3,
      inventory: {
        create: [
          { serialNumber: 'SN-STL-2001', status: InventoryStatus.IN_STOCK, storageLocation: 'Bay B-1' }
        ]
      }
    }
  });

  // 3. Create Hearse Fleet
  const hearse1 = await prisma.hearse.create({
    data: {
      vehicleName: 'Cadillac Master Coach #1',
      make: 'Cadillac',
      model: 'XT6 Coach',
      year: 2023,
      licensePlate: 'FH-01-CAD',
      status: HearseStatus.AVAILABLE,
      currentMileage: 14200,
      nextServiceMileage: 18000,
      nextServiceDate: new Date('2025-06-01'),
    }
  });

  await prisma.hearse.create({
    data: {
      vehicleName: 'Lincoln Grand Coach #2',
      make: 'Lincoln',
      model: 'Continental Coach',
      year: 2022,
      licensePlate: 'FH-02-LNC',
      status: HearseStatus.AVAILABLE,
      currentMileage: 32400,
      nextServiceMileage: 35000,
      nextServiceDate: new Date('2025-04-15'),
    }
  });

  // 4. Create Client & Deceased
  const client = await prisma.client.create({
    data: {
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@example.com',
      phonePrimary: '555-4321',
      addressLine1: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      deceased: {
        create: {
          firstName: 'Hugh',
          lastName: 'Vance',
          dateOfBirth: new Date('1945-03-12'),
          dateOfDeath: new Date('2025-02-18'),
          gender: 'Male',
          heightInches: 71,
          weightPounds: 175
        }
      }
    },
    include: { deceased: true }
  });

  // 5. Create Booking
  await prisma.booking.create({
    data: {
      bookingNumber: 'FH-2025-0001',
      clientId: client.id,
      deceasedId: client.deceased[0].id,
      serviceType: ServiceType.TRADITIONAL_FUNERAL,
      serviceDate: new Date('2025-03-01'),
      serviceStartTime: '10:00 AM',
      serviceEndTime: '1:00 PM',
      venueName: 'Main St. Chapel',
      status: BookingStatus.CONFIRMED,
      assignedDirectorId: admin.id,
      totalAmount: 5600.00,
      amountPaid: 2000.00,
      paymentStatus: PaymentStatus.PARTIAL,
      hearseAssignments: {
        create: {
          hearseId: hearse1.id,
          driverId: admin.id,
          scheduledDate: new Date('2025-03-01'),
          departureTime: '09:00 AM',
          estimatedReturnTime: '02:00 PM',
          pickupLocation: 'Funeral Home Main Chapel',
          destination: 'Oakridge Memorial Park'
        }
      }
    }
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.();
  });
