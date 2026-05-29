import { Footer } from "@/components/custom/footer";
import { LibraryIcon } from "lucide-react";

/**
 * Renders the Home page layout with the "MeowAni" heading and a rounded "Library" call-to-action.
 *
 * @returns The Home page JSX element containing the title and a link to `/library`.
 */
export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex gap-5 w-full max-w-3xl mx-auto flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <span className="truncate leading-tight text-xl font-extrabold font-stretch-100%">
          MeowAni
        </span>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/library"
            rel="noopener noreferrer"
          >
            <LibraryIcon />
            Library
          </a>
        </div>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
}
