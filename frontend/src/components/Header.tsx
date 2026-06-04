import Link from "next/link";
import { fetchCategories } from "@/lib/directus";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { NavLinks } from "./NavLinks";
import { Logo } from "./ui/Logo";

export async function Header() {
  const categories = await fetchCategories();
  const socialLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
    whatsapp: whatsappContactUrl(),
  };

  return (
    <header className="sticky left-0 right-0 top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5">
        <Link
          href="/"
          aria-label="Los Álamos — inicio"
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Logo variant="full" />
        </Link>
        <NavLinks categories={categories} socialLinks={socialLinks} />
      </div>
    </header>
  );
}
