import type { IFeatureOptInService } from "@calcom/features/feature-opt-in/services/IFeatureOptInService";

import { createContainer } from "../di";
import { moduleLoader as featureOptInServiceModuleLoader } from "../modules/FeatureOptInService";

export function getFeatureOptInService(): IFeatureOptInService {
  const featureOptInServiceContainer = createContainer();
  featureOptInServiceModuleLoader.loadModule(featureOptInServiceContainer);
  return featureOptInServiceContainer.get<IFeatureOptInService>(featureOptInServiceModuleLoader.token);
}
