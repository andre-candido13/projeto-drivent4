import { prisma } from '@/config'
import { Room } from '@prisma/client';


async function getBooking (userId: number){

    return prisma.booking.findFirst({
        where: {
            userId},
        include: {
            Room: true
        }
    })
}


async function postBooking (roomId: number, userId: number) {

    return prisma.booking.create({
        data: { roomId, userId },
    })

}

async function findRoom (roomId: number){

    return prisma.room.findFirst({
        where: {
            id: roomId,
          },
          include: {
            Booking: true,
          },
        });
    }

    async function Booking(bookingId: number, userId: number) {
        return prisma.booking.findFirst({
          where: {
            id: bookingId,
            userId,
          },
        });
      }


    async function updateBooking (userId: number, roomId: number, bookingId: number) {
        return prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            userId,
            roomId,
          },
        });
      }


const getBookingRepository = {
    getBooking, 
    postBooking,
    findRoom,
    updateBooking,
    Booking
}

export default getBookingRepository