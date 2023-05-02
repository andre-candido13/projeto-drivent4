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

async function numberOfRooms(roomId: number) {
    
    return prisma.booking.count({
        where: { roomId }
    })
}

async function postBooking (roomId: number, userId: number) {

    return prisma.booking.create({
        data: { roomId, userId },
    })

}

async function findRoom (userId: number, bookingId: number){

    return prisma.booking.findFirst({
        where: {
            userId,
            id: bookingId,
          },
        });

}

async function updateBooking(roomId: number, bookingId: number, userId: number) {

    const updated = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        roomId,
        userId,
      },
    });
  
    return updated.id;
  }


const getBookingRepository = {
    getBooking, 
    postBooking,
    findRoom,
    numberOfRooms,
    updateBooking
}

export default getBookingRepository