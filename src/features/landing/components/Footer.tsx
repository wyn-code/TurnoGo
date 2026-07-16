import TermsAndConditionsDialog from "@/components/legal/TermsAndConditionsDialog";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="/" className="text-xl font-bold text-foreground">TurnoGo</a>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Explorar</a>
          <a href="#" className="transition-colors hover:text-foreground">Para negocios</a>
          <a href="#" className="transition-colors hover:text-foreground">Contacto</a>
          <TermsAndConditionsDialog
            trigger={
              <button
                type="button"
                className="transition-colors hover:text-foreground"
              >
                Términos
              </button>
            }
          />
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TurnoGo. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
