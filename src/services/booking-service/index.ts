import { forbiddenError, notFoundError } from "@/errors"
import getBookingRepository from "@/repositories/booking-repository";
import { Room } from "@prisma/client"
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import hotelRepository from "@/repositories/hotel-repository";




async function getBooking (userId: number): Promise<{Room: Room, id: number}> {

const booking = await getBookingRepository.getBooking(userId)

if (!booking) throw notFoundError()

return booking;
}

async function viabilityOfRooms (userId: number){

    const enrollment = await enrollmentRepository.findEnrollment(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
  
    if (!ticket.TicketType.includesHotel || ticket.status !== 'PAID' || ticket.TicketType.isRemote)
      throw forbiddenError();
  
    return;
  }




async function postBooking (userId: number, roomId: number) {

await viabilityOfRooms(userId)

const returnBooking = await hotelRepository.getRoomWithBookings(roomId)
if (!returnBooking) throw notFoundError

if (returnBooking.capacity <= returnBooking.Booking.length) throw forbiddenError();

const booking = await getBookingRepository.postBooking(userId, roomId);

return booking;

}


async function putBooking (userId: number, roomId: number, bookingId: number) {

await viabilityOfRooms(userId)

const user = await hotelRepository.getRoomWithBookings(roomId)

if (!user) throw notFoundError()

if (user.capacity <= user.Booking.length) throw forbiddenError();

const booking = await getBookingRepository.findRoom(userId, bookingId);
if (!booking) throw forbiddenError();

return await getBookingRepository.updateBooking(userId, bookingId, roomId);
}


const bookingService = {
    getBooking,
    postBooking,
    viabilityOfRooms,
    putBooking
}

export default bookingService;