export default function Footer() {
  return (
    <footer
      id="contact"
      className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
    >
      <span>© 2026 Mind Stack. All rights reserved.</span>
      <div className="flex gap-6">
        <a
          className="transition-colors hover:text-foreground"
          href="mailto:hello@mindstack.ai"
        >
          hello@mindstack.ai
        </a>
        <a className="transition-colors hover:text-foreground" href="#overview">
          Back to top
        </a>
      </div>
    </footer>
  );
}
