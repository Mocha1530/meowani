import type { SocialSharingConfig } from "@/types/social";

const socialSharing: SocialSharingConfig = {
  display: true,
  platforms: {
    x: true,
    linkedin: false,
    facebook: true,
    pinterest: true,
    whatsapp: false,
    reddit: true,
    telegram: true,
    email: false,
    copyLink: true,
  },
};

export { socialSharing };
