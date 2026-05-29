"use client";

import { socialSharing } from "@/constants/social";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import Link from "next/link";
import { CopyIcon, ExternalLinkIcon, LinkIcon, MailIcon } from "lucide-react";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaPinterestP,
  FaWhatsapp,
  FaRedditAlien,
  FaTelegram,
} from "react-icons/fa6";
import { cn } from "@/lib/shadcn/utils";

interface SocialSharingProps {
  title: string;
  url: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  twTheme: { card: string; icon: string };
  label: string;
  generateUrl: (title: string, url: string) => string;
}

const socialPlatforms: Record<string, SocialPlatform> = {
  x: {
    name: "x",
    icon: <FaXTwitter />,
    twTheme: {
      card: "dark:bg-black/20 dark:border-black/70",
      icon: "bg-black/70 text-white",
    },
    label: "X (Twitter)",
    generateUrl: (title, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  linkedin: {
    name: "linkedin",
    icon: <FaLinkedinIn />,
    twTheme: {
      card: "dark:bg-blue-700/5 dark:border-blue-700/20",
      icon: "bg-blue-700/20 text-blue-700",
    },
    label: "LinkedIn",
    generateUrl: (title, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    name: "facebook",
    icon: <FaFacebookF />,
    twTheme: {
      card: "dark:bg-blue-600/5 dark:border-blue-600/20",
      icon: "bg-blue-600/20 text-blue-600",
    },
    label: "Facebook",
    generateUrl: (title, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  pinterest: {
    name: "pinterest",
    icon: <FaPinterestP />,
    twTheme: {
      card: "dark:bg-rose-600/5 dark:border-rose-600/20",
      icon: "bg-rose-600/20 text-rose-600",
    },
    label: "Pinterest",
    generateUrl: (title, url) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  whatsapp: {
    name: "whatsapp",
    icon: <FaWhatsapp />,
    twTheme: {
      card: "dark:bg-green-500/5 dark:border-green-500/20",
      icon: "bg-green-500/20 text-green-500",
    },
    label: "WhatsApp",
    generateUrl: (title, url) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  reddit: {
    name: "reddit",
    icon: <FaRedditAlien />,
    twTheme: {
      card: "dark:bg-orange-600/5 dark:border-orange-600/20",
      icon: "bg-orange-600/20 text-orange-600",
    },
    label: "Reddit",
    generateUrl: (title, url) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  telegram: {
    name: "telegram",
    icon: <FaTelegram />,
    twTheme: {
      card: "dark:bg-sky-600/5 dark:border-sky-600/20",
      icon: "bg-sky-600/20 text-sky-600",
    },
    label: "Telegram",
    generateUrl: (title, url) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  email: {
    name: "email",
    icon: <MailIcon />,
    twTheme: {
      card: "dark:bg-blue-500/5 dark:border-blue-500/20",
      icon: "bg-blue-500/20 text-blue-500",
    },
    label: "Email",
    generateUrl: (title, url) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this anime: ${url}`)}`,
  },
};

export function SocialSharing({ title, url }: SocialSharingProps) {
  if (!socialSharing.display) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied successfully");
    } catch (error) {
      console.error("[SocialSharing] Failed to copy: ", error);
      toast.error("Failed to Copy");
    }
  };

  const enabledPlatforms = Object.entries(socialSharing.platforms)
    .filter(([_, enabled]) => enabled && _ !== "copyLink")
    .map(([platformKey]) => ({
      key: platformKey,
      ...socialPlatforms[platformKey],
    }))
    .filter((platform) => platform.name);

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {enabledPlatforms.map((platform, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon-lg"
          className={cn(
            "group relative flex items-center gap-2.5 overflow-hidden rounded-md hover:-translate-y-0.5 border px-3 py-2.5 transition-all duration-200 hover:shadow-lg dark:bg-muted-foreground/5 dark:border-muted-foreground/20 size-auto",
            platform.twTheme.card,
          )}
          asChild
        >
          <Link
            href={platform.generateUrl(title, url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success("Shared successfully")}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold tracking-tight",
                platform.twTheme.icon,
              )}
            >
              {platform.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[13px] font-semibold text-foreground/90">
                {platform.label}
              </span>
              <span className="truncate text-[10px] text-muted-foreground/50 group-hover:text-foreground/50 transition-colors">
                {"Share to friends"}
              </span>
            </div>
            <ExternalLinkIcon className="ml-auto size-3 shrink-0 text-muted-foreground/50 transition-all group-hover:text-foreground/50" />
          </Link>
        </Button>
      ))}
      {socialSharing.platforms.copyLink && (
        <Button
          variant="outline"
          size="icon-lg"
          className="group relative flex items-center gap-2.5 overflow-hidden rounded-md hover:-translate-y-0.5 border px-3 py-2.5 transition-all duration-200 hover:shadow-lg dark:bg-muted-foreground/5 dark:border-muted-foreground/20 size-auto"
          onClick={handleCopy}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold tracking-tight bg-muted-foreground/20 text-muted-foreground">
            <LinkIcon />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[13px] font-semibold text-foreground/90">
              Copy link
            </span>
          </div>
          <CopyIcon className="ml-auto size-3 shrink-0 text-muted-foreground/50 transition-all group-hover:text-foreground/50" />
        </Button>
      )}
    </div>
  );
}
