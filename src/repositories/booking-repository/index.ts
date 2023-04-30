import { prisma } from '@/config'
import { Room } from '@prisma/client';


async function getBooking (userId: number): Promise<{ Room: Room; id: number }> {

    return prisma.booking.findFirst({
        where: {
            userId},
        select: {
            id: true,
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

async function findRoom (roomId: number): Promise <Room>{

    return prisma.room.findFirst({
        where: {
        id: roomId}
    })

}










const getBookingRepository = {
    getBooking, 
    postBooking,
    findRoom,
    numberOfRooms
}

export default getBookingRepository