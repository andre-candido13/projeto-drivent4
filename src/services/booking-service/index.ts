import { BookingError, notFoundError } from "@/errors"
import getBookingRepository from "@/repositories/booking-repository";
import hotelsService from "../hotels-service";



async function getBooking (userId: number) {

const booking = await getBookingRepository.getBooking(userId)

if (!booking) throw notFoundError()

return booking;
}

async function viabilityOfRooms (roomId: number) {

const findRooms = await getBookingRepository.findRoom(roomId)

if(!findRooms) throw notFoundError()

const qtyOfBookings = await getBookingRepository.numberOfRooms(roomId)

if (qtyOfBookings >= findRooms.capacity) throw BookingError()

return findRooms;


}

async function postBooking (userId: number, roomId: number) {

await hotelsService.listHotels(userId)

await viabilityOfRooms(roomId)

const returnBooking = await getBookingRepository.postBooking(userId, roomId)

return returnBooking;

}


async function putBooking (userId: number, bookingId: string, roomId: number) {

const idBooking = Number(bookingId)

await viabilityOfRooms(roomId)

const user = getBookingRepository.getBooking(userId)

if (!user) throw BookingError()

return await getBookingRepository.updateBooking(roomId, idBooking, userId)



}


const bookingService = {
    getBooking,
    postBooking,
    viabilityOfRooms,
    putBooking
}

export default bookingService;