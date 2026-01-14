/**
 * Attendee lookup interface
 * 
 * This interface provides methods for looking up attendee information.
 */
export interface IAttendeeRepository {
    findAttendeeById(id: number): Promise<{ name: string; email: string } | null>;
}

