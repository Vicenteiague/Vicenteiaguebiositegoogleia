import { MapPin } from "lucide-react";

interface MapSectionProps {
  embedUrl: string;
  linkUrl: string;
  title: string;
}

export function MapSection({ embedUrl, linkUrl, title }: MapSectionProps) {
  if (!embedUrl) return null;

  return (
    <section className="mapa" aria-label="Nossa localização no mapa">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full rounded-lg shadow-md"
      />
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mapa-botao"
        >
          <MapPin className="w-4 h-4 text-[#bef226]" aria-hidden="true" />
          <span>Abrir no Google Maps</span>
        </a>
      )}
    </section>
  );
}
