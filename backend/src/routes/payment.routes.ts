import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// POST /api/payments - Record a new payment against a booking
router.post('/', async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, reference } = req.body;
    const parsedAmount = parseFloat(amount) || 0;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          bookingId,
          amount: parsedAmount,
          paymentMethod: paymentMethod || 'CASH',
          reference: reference || null,
        },
      });

      // 2. Fetch booking and calculate updated totals
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (booking) {
        const currentPaid = parseFloat(booking.amountPaid.toString()) || 0;
        const totalAmount = parseFloat(booking.totalAmount.toString()) || 0;
        const newAmountPaid = currentPaid + parsedAmount;

        let newStatus: 'PENDING' | 'PARTIAL' | 'PAID' = 'PENDING';
        if (newAmountPaid >= totalAmount && totalAmount > 0) {
          newStatus = 'PAID';
        } else if (newAmountPaid > 0) {
          newStatus = 'PARTIAL';
        }

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            amountPaid: newAmountPaid,
            paymentStatus: newStatus,
          },
        });
      }

      return payment;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

export default router;