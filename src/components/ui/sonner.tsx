"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // icons={{
      //   success: <CircleCheckIcon className="size-4" />,
      //   info: <InfoIcon className="size-4" />,
      //   warning: <TriangleAlertIcon className="size-4" />,
      //   error: <OctagonXIcon className="size-4" />,
      //   loading: <Loader2Icon className="size-4 animate-spin" />,
      // }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // toast: "cn-toast",
          toast:
            "group/toast data-[type=success]:!bg-success-bg data-[type=success]:!border-success-border data-[type=success]:!text-success-text data-[type=info]:!bg-info-bg data-[type=info]:!border-info-border data-[type=info]:!text-info-text data-[type=warning]:!bg-warning-bg data-[type=warning]:!border-warning-border data-[type=warning]:!text-warning-text data-[type=error]:!bg-error-bg data-[type=error]:!border-error-border data-[type=error]:!text-error-text",
          title: "!font-medium",
          description: "!text-muted-foreground",
          closeButton:
            "group-data-[type=success]/toast:!bg-success-bg group-data-[type=success]/toast:!border-success-border group-data-[type=success]/toast:!text-success-text group-data-[type=info]/toast:!bg-info-bg group-data-[type=info]/toast:!border-info-border group-data-[type=info]/toast:!text-info-text group-data-[type=warning]/toast:!bg-warning-bg group-data-[type=warning]/toast:!border-warning-border group-data-[type=warning]/toast:!text-warning-text group-data-[type=error]/toast:!bg-error-bg group-data-[type=error]/toast:!border-error-border group-data-[type=error]/toast:!text-error-text",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
