import { AuthenticatedRequest } from "@/middlewares";
import { NextFunction } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";
import { Response } from "express";


export async function getBooking ( req: AuthenticatedRequest, res: Response, next: NextFunction) {

const { userId } = req

try {

    const booking = await bookingService.getBooking(userId)
    return res.status(httpStatus.OK).send(booking)

} catch (error) {
next(error)
}
}

export async function postBooking ( req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const { roomId } = req.body

try {

    const booking = await bookingService.postBooking(parseFloat(roomId), userId)
    return res.status(httpStatus.OK).send({ bookingId: booking })

} catch (error) {
    next(error)
}
}



