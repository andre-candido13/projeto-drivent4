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

    const booking = await bookingService.postBooking(roomId, userId)
    if (!booking) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(booking)

} catch (error) {
    if (error.name === 'UnauthorizedError') {
        return res.sendStatus(httpStatus.UNAUTHORIZED)}
    next(error)
}
}

export async function putBooking (req: AuthenticatedRequest, res: Response, next: NextFunction) {

const { userId } = req
const { roomId } = req.body
const { bookingId } = req.params



try{

    const updated = await bookingService.putBooking(userId, Number(bookingId),roomId)
    if (updated) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.sendStatus(httpStatus.OK).send(updated)

} catch (error) {
    if (error.name === 'UnauthorizedError') {
        return res.sendStatus(httpStatus.UNAUTHORIZED)}
    next(error)
}



}



