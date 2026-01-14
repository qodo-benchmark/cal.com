import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { Resource, CustomAction } from "@calcom/features/pbac/domain/types/permission-registry";
import { getSpecificPermissions } from "@calcom/features/pbac/lib/resource-permissions";
import { MembershipRole } from "@calcom/prisma/enums";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

const SettingsOrganizationsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const orgExists =
    session?.user?.org || session?.user?.profile?.organizationId || session?.user?.profile?.organization;
  if (!orgExists) {
    return redirect("/settings/my-account/profile");
  }

  // Permission check for listing members
  if (session?.user?.id && session?.user?.profile?.organizationId && session?.user?.org) {
    const orgPermissions = await getSpecificPermissions({
      userId: session.user.id,
      teamId: session.user.profile.organizationId,
      resource: Resource.Organization,
      userRole: session.user.org.role,
      actions: [CustomAction.ListMembers],
      fallbackRoles: {
        [CustomAction.ListMembers]: {
          roles: [MembershipRole.ADMIN, MembershipRole.OWNER, MembershipRole.MEMBER],
        },
      },
    });

    if (!orgPermissions[CustomAction.ListMembers]) {
      return redirect("/settings/my-account/profile");
    }
  }

  return children;
};

export default SettingsOrganizationsLayout;
