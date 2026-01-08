import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import { getTranslate } from "app/_utils";

import { CTA_CONTAINER_CLASS_NAME } from "@calcom/features/data-table/lib/utils";

import Shell from "~/shell/Shell";

import { checkInsightsPagePermission } from "./checkInsightsPagePermission";
import UpgradeTipWrapper from "./UpgradeTipWrapper";

export default async function InsightsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslate();

  // Check permissions for insights access
  await checkInsightsPagePermission();

  return (
    <Shell withoutMain={true}>
      <ShellMainAppDir
        heading={t("insights")}
        subtitle={t("insights_subtitle")}
        actions={<div className={`flex items-center gap-2 ${CTA_CONTAINER_CLASS_NAME}`} />}>
        <UpgradeTipWrapper>{children}</UpgradeTipWrapper>
      </ShellMainAppDir>
    </Shell>
  );
}
