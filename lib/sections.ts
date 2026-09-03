/**
 * The page's sections, in document order. Drives the nav and the scroll spy,
 * so the `id`s here must match the `id` on each `h2` in app/page.tsx. Adding a
 * section to the page without adding it here leaves it unreachable from the
 * nav; the reverse leaves a dot pointing at nothing.
 */
export interface Section {
  id: string;
  label: string;
}

export const sections: Section[] = [
  { id: "bio", label: "Bio" },
  { id: "currently", label: "Currently" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Get in Touch" },
];
