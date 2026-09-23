import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        client: true,
        deceased: true,
        hearseAssignments: {
          include: { hearse: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      clientFirstName, clientLastName, clientEmail, clientPhone, clientAddress, clientCity, clientState, clientZip,
      deceasedFirstName, deceasedLastName, deceasedDob, deceasedDod, deceasedGender,
      serviceType, serviceDate, serviceStartTime, serviceEndTime, venueName, totalAmount, amountPaid,
      casketInventoryId, hearseId, pickupLocation, destination
    } = req.body;

    const count = await prisma.booking.count();
    const bookingNumber = 'FH-' + new Date().getFullYear() + '-' + String(count + 1).padStart(4, '0');

    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          firstName: clientFirstName || 'Unknown',
          lastName: clientLastName || 'Client',
          email: clientEmail || null,
          phonePrimary: clientPhone || '555-0000',
          addressLine1: clientAddress || null,
          city: clientCity || null,
          state: clientState || null,
          zipCode: clientZip || null,
        },
      });

      const deceased = await tx.deceased.create({
        data: {
          clientId: client.id,
          firstName: deceasedFirstName || 'Unknown',
          lastName: deceasedLastName || 'Deceased',
          dateOfBirth: deceasedDob ? new Date(deceasedDob) : null,
          dateOfDeath: deceasedDod ? new Date(deceasedDod) : new Date(),
          gender: deceasedGender || null,
        },
      });

      const parsedTotal = parseFloat(totalAmount) || 0;
      const parsedPaid = parseFloat(amountPaid) || 0;
      const paymentStatus = parsedPaid >= parsedTotal && parsedTotal > 0 ? 'PAID' : (parsedPaid > 0 ? 'PARTIAL' : 'PENDING');

      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          clientId: client.id,
          deceasedId: deceased.id,
          serviceType: serviceType || 'TRADITIONAL_FUNERAL',
          serviceDate: serviceDate ? new Date(serviceDate) : null,
          serviceStartTime: serviceStartTime || '10:00 AM',
          serviceEndTime: serviceEndTime || '01:00 PM',
          venueName: venueName || 'Main Chapel',
          totalAmount: parsedTotal,
          amountPaid: parsedPaid,
          paymentStatus: paymentStatus,
          status: 'CONFIRMED',
        },
      });

      if (casketInventoryId) {
        await tx.casketInventory.update({
          where: { id: casketInventoryId },
          data: {
            status: 'RESERVED',
            bookingId: booking.id,
          },
        });
      }

      if (hearseId) {
        await tx.hearseAssignment.create({
          data: {
            hearseId: hearseId,
            bookingId: booking.id,
            scheduledDate: serviceDate ? new Date(serviceDate) : new Date(),
            departureTime: serviceStartTime || '09:00 AM',
            pickupLocation: pickupLocation || 'Funeral Home Chapel',
            destination: destination || venueName || 'Memorial Park',
            status: 'scheduled',
          },
        });
      }

      return booking;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create arrangement' });
  }
});

export default router;
