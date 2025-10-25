export { BaseRepository } from "./BaseRepository";
export { BusinessRepository } from "./BusinessRepository";
export { ContentRepository } from "./ContentRepository";
export { TemplateRepository } from "./TemplateRepository";
export { MediaRepository } from "./MediaRepository";

import { BusinessRepository } from "./BusinessRepository";
import { ContentRepository } from "./ContentRepository";
import { TemplateRepository } from "./TemplateRepository";
import { MediaRepository } from "./MediaRepository";

// Create repository instances
export const businessRepository = new BusinessRepository();
export const contentRepository = new ContentRepository();
export const templateRepository = new TemplateRepository();
export const mediaRepository = new MediaRepository();
