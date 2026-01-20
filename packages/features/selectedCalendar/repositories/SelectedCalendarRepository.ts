import type { ISelectedCalendarRepository } from "@calcom/features/selectedCalendar/repositories/SelectedCalendarRepository.interface";
import type { PrismaClient } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";

// Schema definition mixed in handler file
export type FindNextSubscriptionBatchParams = {
  take: number;
  teamIds: number[];
  integrations: string[];
  genericCalendarSuffixes?: string[];
};

export class SelectedCalendarRepository implements ISelectedCalendarRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findById(id: string) {
    return this.prismaClient.selectedCalendar.findUnique({
      where: { id },
    });
  }

  async findByChannelId(channelId: string) {
    return this.prismaClient.selectedCalendar.findFirst({ where: { channelId } });
  }

  async findNextSubscriptionBatch({
    take,
    teamIds,
    integrations,
    genericCalendarSuffixes,
  }: FindNextSubscriptionBatchParams) {
    return this.prismaClient.selectedCalendar.findMany({
      where: {
        integration: { in: integrations },
        OR: [{ syncSubscribedAt: null }, { channelExpiration: { lte: new Date() } }],
        user: {
          teams: {
            some: {
              teamId: { in: teamIds },
              accepted: true,
            },
          },
        },
        AND: genericCalendarSuffixes?.map((suffix) => ({
          NOT: { externalId: { endsWith: suffix } },
        })),
      },
      take,
    });
  }

  async updateSyncStatus(
    id: string,
    data: Pick<
      Prisma.SelectedCalendarUpdateInput,
      "syncToken" | "syncedAt" | "syncErrorAt" | "syncErrorCount"
    >
  ) {
    return this.prismaClient.selectedCalendar.update({
      where: { id },
      data,
    });
  }

  async updateSubscription(
    id: string,
    data: Pick<
      Prisma.SelectedCalendarUpdateInput,
      | "channelId"
      | "channelResourceId"
      | "channelResourceUri"
      | "channelKind"
      | "channelExpiration"
      | "syncSubscribedAt"
    >
  ) {
    return this.prismaClient.selectedCalendar.update({
      where: { id },
      data,
    });
  }
}
