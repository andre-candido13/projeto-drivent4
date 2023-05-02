import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';

import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createUser,
  createTicketTypeWithHotel
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  describe('When token is invalid or does not exist', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await server.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
})

describe('When token is valid', () => {
  it('Should respond with status 200', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.OK);
    expect(result.body).toEqual({
      id: booking.id,
      Room: {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hotelId: room.hotelId,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString(),
      },
    });
  });


it('Should respond with status 404 if user has no booking', async () => {
  const user = await createUser();
  const token = await generateValidToken(user);

  const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

  expect(result.status).toBe(httpStatus.NOT_FOUND);
});
})

describe('POST /booking', () => {
  describe('When token is invalid or does not exist', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await server.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
})

describe('When token is valid', () => {
  it('Should respond with status 200 and bookingId', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    await createPayment(ticket.id, ticketType.price);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(result.status).toBe(httpStatus.OK);
    expect(result.body).toEqual({
      bookingId: expect.any(Number),
    });
  });





})

