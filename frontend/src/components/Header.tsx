import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "@/lib/directus";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { NavLinks } from "./NavLinks";

export async function Header() {
  const categories = await fetchCategories();
  const socialLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
    whatsapp: whatsappContactUrl(),
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-10 border-b border-[var(--brand)]/20 bg-[var(--brand)] shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Ir al inicio">
          <Image
            src="/logo.png"
            alt="LOS ÁLAMOS Indumentaria laboral"
            width={44}
            height={44}
            className="rounded-full object-contain"
          />
        </Link>
        <NavLinks categories={categories} socialLinks={socialLinks} />
      </div>
    </header>
  );
}
