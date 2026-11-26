export const CONTACT_REASONS = ["general", "support", "medical-team", "volunteer", "partnership", "other"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];
