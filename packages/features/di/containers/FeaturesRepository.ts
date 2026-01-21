import { createContainer } from "../di";
import { type FeaturesRepository, moduleLoader as featuresRepositoryModuleLoader } from "../modules/FeaturesRepository";

export function getFeaturesRepository(): FeaturesRepository {
  const featuresRepositoryContainer = createContainer();
  featuresRepositoryModuleLoader.loadModule(featuresRepositoryContainer);
  return featuresRepositoryContainer.get<FeaturesRepository>(featuresRepositoryModuleLoader.token);
}
