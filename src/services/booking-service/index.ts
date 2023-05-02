import { forbiddenError, notFoundError } from "@/errors"
import getBookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Booking } from "@prisma/client";


//async function viabilityOfRooms (userId: number){

    //const enrollment = await enrollmentRepository.findEnrollment(userId);
    //if (!enrollment) throw notFoundError();
  
    //const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
   // if (!ticket) throw notFoundError();
  
   // if (!ticket.TicketType.includesHotel || ticket.status !== 'PAID' || ticket.TicketType.isRemote)
     // throw forbiddenError();
  
    //return;
  //}


async function getBooking (userId: number): Promise<Booking>{

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
    
const booking = await getBookingRepository.getBooking(userId);
if (!booking) throw notFoundError();

return booking;
  
}


async function postBooking (userId: number, roomId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

const room = await getBookingRepository.findRoom(roomId);
if (!room) {
  throw notFoundError()}

if (room.capacity <= room.Booking.length) {

 throw forbiddenError() }

const booking = await getBookingRepository.postBooking(userId, roomId);
if (!booking) {
  throw notFoundError()}

const bookingId = { bookingId: booking.id };

return bookingId;
}




async function putBooking (userId: number, roomId: number, bookingId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

const room = await getBookingRepository.findRoom(roomId)

if (!room) throw notFoundError()

if (room.capacity <= room.Booking.length) {
  throw forbiddenError()}

const booking = await getBookingRepository.Booking(userId, bookingId);
if (!booking) {

 throw forbiddenError()}

const response = { bookingId: booking.id };

return response

}


const bookingService = {
    getBooking,
    postBooking,
    //viabilityOfRoom s,
    putBooking
}

export default bookingService;