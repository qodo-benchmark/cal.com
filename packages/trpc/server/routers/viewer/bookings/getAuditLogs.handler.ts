import type { PrismaClient } from "@calcom/prisma/client";
import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../types";
import type { TGetAuditLogsInputSchema } from "./getAuditLogs.schema";

type GetAuditLogsOptions = {
    ctx: {
        user: NonNullable<TrpcSessionUser>;
        prisma: PrismaClient;
    };
    input: TGetAuditLogsInputSchema;
};

export const getAuditLogsHandler = async ({ ctx, input }: GetAuditLogsOptions) => {
    const { prisma, user } = ctx;
    const { bookingUid } = input;

    // First, get the booking to verify permissions
    const booking = await prisma.booking.findUnique({
        where: {
            uid: bookingUid,
        },
        select: {
            id: true,
            userId: true,
            eventTypeId: true,
            originalBookingId: true,
            attendees: {
                select: {
                    email: true,
                },
            },
        },
    });

    if (!booking) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
        });
    }

    // Check if user has permission to view this booking's audit logs
    const isBookingOwner = booking.userId === user.id;
    const isAttendee = booking.attendees.some((attendee) => attendee.email === user.email);

    // Check if user is team admin/owner for the event type
    let isTeamAdminOrOwner = false;
    if (booking.eventTypeId) {
        const eventType = await prisma.eventType.findUnique({
            where: { id: booking.eventTypeId },
            select: {
                teamId: true,
                team: {
                    select: {
                        members: {
                            where: {
                                userId: user.id,
                                role: {
                                    in: ["ADMIN", "OWNER"],
                                },
                            },
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (eventType?.team?.members && eventType.team.members.length > 0) {
            isTeamAdminOrOwner = true;
        }
    }

    if (!isBookingOwner && !isAttendee && !isTeamAdminOrOwner) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view audit logs for this booking",
        });
    }

    // Determine the original booking ID for this chain
    const originalIdForChain = booking.originalBookingId ?? booking.id;

    // Get all bookings in this reschedule chain
    const allBookingsInChain = await prisma.booking.findMany({
        where: {
            OR: [
                { id: originalIdForChain },
                { originalBookingId: originalIdForChain },
            ],
        },
        select: {
            id: true,
            uid: true,
        },
    });

    // Build a map of bookingId -> reschedule timestamp
    // We need to find when each booking was rescheduled (if at all)
    const rescheduleTimestamps = new Map<string, Date>();
    for (const chainBooking of allBookingsInChain) {
        const rescheduleAudit = await prisma.bookingAudit.findFirst({
            where: {
                bookingId: String(chainBooking.id),
                action: 'RESCHEDULED',
            },
            select: { timestamp: true },
            orderBy: { timestamp: 'asc' }, // Get first reschedule
        });

        if (rescheduleAudit) {
            rescheduleTimestamps.set(String(chainBooking.id), rescheduleAudit.timestamp);
        }
    }

    // Fetch audit logs for all bookings in chain
    const bookingIds = allBookingsInChain.map(b => String(b.id));
    const auditLogs = await prisma.bookingAudit.findMany({
        where: {
            bookingId: { in: bookingIds },
        },
        include: {
            actor: {
                select: {
                    id: true,
                    type: true,
                    userId: true,
                    attendeeId: true,
                    email: true,
                    phone: true,
                    name: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            timestamp: "desc",
        },
    });

    // Filter: only show logs before or at reschedule timestamp for rescheduled bookings
    const filteredAuditLogs = auditLogs.filter(log => {
        const rescheduleTime = rescheduleTimestamps.get(log.bookingId);
        if (!rescheduleTime) return true; // No reschedule yet, show all logs
        // Only logs before or at the reschedule time (inclusive to show the RESCHEDULED action itself)
        return log.timestamp <= rescheduleTime;
    });

    // Enrich actor information with user details if userId exists
    const enrichedAuditLogs = await Promise.all(
        filteredAuditLogs.map(async (log) => {
            let actorDisplayName = log.actor.name || "System";
            let actorEmail = log.actor.email;

            if (log.actor.userId) {
                const actorUser = await prisma.user.findUnique({
                    where: { id: log.actor.userId },
                    select: {
                        name: true,
                        email: true,
                    },
                });

                if (actorUser) {
                    actorDisplayName = actorUser.name || actorUser.email;
                    actorEmail = actorUser.email;
                }
            }

            return {
                id: log.id,
                bookingId: log.bookingId,
                type: log.type,
                action: log.action,
                timestamp: log.timestamp.toISOString(),
                createdAt: log.createdAt.toISOString(),
                data: log.data,
                actor: {
                    ...log.actor,
                    displayName: actorDisplayName,
                    displayEmail: actorEmail,
                },
            };
        })
    );

    return {
        bookingUid,
        auditLogs: enrichedAuditLogs,
    };
};

