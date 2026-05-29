"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/shadcn/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

/**
 * Renders a dialog root element with `data-slot="dialog"` and forwards all provided props.
 *
 * @param props - Props to pass through to the underlying dialog root element
 * @returns The rendered dialog root element
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Renders a Radix Dialog Trigger with a `data-slot="dialog-trigger"`.
 *
 * @param props - Props forwarded to the underlying Radix `DialogPrimitive.Trigger`
 * @returns A React element that renders the dialog trigger
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Renders a dialog portal element and forwards all received props.
 *
 * @returns The rendered portal element with `data-slot="dialog-portal"`.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Renders a Radix Dialog close control with a consistent `data-slot` attribute.
 *
 * Forwards all received props to the underlying Radix `DialogPrimitive.Close` element.
 *
 * @returns The rendered `DialogPrimitive.Close` element with `data-slot="dialog-close"`.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Renders a dialog overlay with the component's default backdrop styling.
 *
 * Merges the provided `className` with the component's default overlay classes and forwards all other props to the underlying Radix `DialogPrimitive.Overlay`. Adds `data-slot="dialog-overlay"`.
 *
 * @param className - Additional CSS classes to merge with the default overlay styles
 * @param props - Additional props forwarded to the underlying overlay element
 * @returns The rendered dialog overlay element
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders dialog content inside a portal with a backdrop overlay and an optional close button.
 *
 * The component centers and styles the dialog panel, forwards all native DialogPrimitive.Content props,
 * and always includes its children. It mounts an overlay and places the content into a DialogPortal.
 *
 * @param showCloseButton - When `true`, renders a positioned close icon button in the top-right of the dialog. Defaults to `true`.
 * @returns The dialog content element (including overlay and optional close control) ready to be rendered in the DOM.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 start-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-4 end-4"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Renders a styled header container for dialog content.
 *
 * The element is a `div` with layout classes applied and a `data-slot="dialog-header"` attribute; any additional `div` props (including `className`) are forwarded.
 *
 * @returns A `div` element serving as the dialog header container
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * Renders a responsive dialog footer container and optionally includes a "Close" button.
 *
 * @param className - Additional CSS class names to apply to the footer container
 * @param showCloseButton - When `true`, renders a "Close" button that closes the dialog
 * @param children - Content to display inside the footer
 * @returns The rendered dialog footer element
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/**
 * Renders a dialog title with standardized heading typography and a `data-slot="dialog-title"` attribute.
 *
 * @returns A `DialogPrimitive.Title` element with heading typography classes applied and any provided props forwarded.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading leading-none font-medium", className)}
      {...props}
    />
  );
}

/**
 * Renders a styled description element for a dialog.
 *
 * Applies muted description typography and link styling, and forwards any additional props to the underlying Radix `DialogPrimitive.Description`.
 *
 * @returns A `DialogPrimitive.Description` element with default muted styling and any provided `className` or other props applied.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
