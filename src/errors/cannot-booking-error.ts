
import { ApplicationError } from '@/protocols';

export function BookingError(): ApplicationError {
  return {
    name: 'BookingError',
    message: 'Unavailable to booking this room',
  };
}