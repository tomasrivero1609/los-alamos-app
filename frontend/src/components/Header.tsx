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
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-8 px-4 py-3">
        <NavLinks categories={categories} socialLinks={socialLinks} />
      </div>
    </header>
  );
}
