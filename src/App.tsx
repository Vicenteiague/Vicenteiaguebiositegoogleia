import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Header } from "./components/Header";
import { VideoCard } from "./components/VideoCard";
import { FeaturedProduct } from "./components/FeaturedProduct";
import { CatalogSection } from "./components/CatalogSection";
import { LinksGrid } from "./components/LinksGrid";
import { ServicesSection } from "./components/ServicesSection";
import { ChatAssistant } from "./components/ChatAssistant";
import { MapSection } from "./components/MapSection";
import { Footer } from "./components/Footer";
import { VideoModal, InfoModal, ProductModal, QrModal } from "./components/Modals";
import { conectacardData, type CatalogoItem } from "./data/conectacard";
import { getClientData, allClients } from "./data/clients";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function App() {
  // 1. Resolve path and client slug
  const getInitialRoute = () => {
    if (typeof window === "undefined") return { isLanding: true, slug: "teste" };

    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get("c") || urlParams.get("cliente");

    if (querySlug && allClients[querySlug]) {
      return { isLanding: false, slug: querySlug };
    }

    if (path === "" || path === "/") {
      return { isLanding: true, slug: "teste" };
    }

    // Direct sublinks: /teste, /pizzaria, /farmacia, /superlimpo
    const directSlug = path.replace(/^\//, "").replace(/^clientes\//, "");
    if (allClients[directSlug]) {
      return { isLanding: false, slug: directSlug };
    }

    // Default to biosite for any unknown slug or landing
    return { isLanding: false, slug: directSlug || "teste" };
  };

  const [route, setRoute] = useState(getInitialRoute);

  // Handle browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, "", path);
    } catch {
      // Safe for iframes
    }
    const clean = path.toLowerCase().replace(/\/$/, "");
    if (clean === "" || clean === "/") {
      setRoute({ isLanding: true, slug: "teste" });
    } else {
      const slug = clean.replace(/^\//, "").replace(/^clientes\//, "");
      setRoute({ isLanding: false, slug: slug || "teste" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If on landing page (www.conectacard.com.br/)
  if (route.isLanding) {
    return <LandingPage onNavigate={navigateTo} />;
  }

  // Otherwise, render the requested biosite (/teste, /pizzaria, /farmacia, etc.)
  const data = getClientData(route.slug);

  // Modal states
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isService?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<CatalogoItem | null>(null);

  const handleOpenInfo = (title: string, description: string, isService = false) => {
    setInfoModal({
      isOpen: true,
      title,
      description,
      isService,
    });
  };

  return (
    <main className="biosite-shell min-h-screen relative">
      {/* Top Navigation Bar: Back to Landing Page and Quick Niche Switcher */}
      <div className="bg-[#181818] border-b border-[#2a2a2a] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={() => navigateTo("/")}
          className="inline-flex items-center gap-1.5 text-[#a3a3a3] hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Conectacard (Início)</span>
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[#666] hidden sm:inline">Modelos:</span>
          <button
            onClick={() => navigateTo("/teste")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              route.slug === "teste" || route.slug === "start-mkt-local"
                ? "bg-[#bef226] text-[#121212]"
                : "bg-[#242424] text-[#a3a3a3] hover:text-white"
            }`}
          >
            🚀 /teste
          </button>
          <button
            onClick={() => navigateTo("/pizzaria")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              route.slug === "pizzaria"
                ? "bg-[#bef226] text-[#121212]"
                : "bg-[#242424] text-[#a3a3a3] hover:text-white"
            }`}
          >
            🍕 /pizzaria
          </button>
          <button
            onClick={() => navigateTo("/farmacia")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              route.slug === "farmacia"
                ? "bg-[#bef226] text-[#121212]"
                : "bg-[#242424] text-[#a3a3a3] hover:text-white"
            }`}
          >
            💊 /farmacia
          </button>
          <button
            onClick={() => navigateTo("/superlimpo")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              route.slug === "superlimpo"
                ? "bg-[#bef226] text-[#121212]"
                : "bg-[#242424] text-[#a3a3a3] hover:text-white"
            }`}
          >
            🧼 /superlimpo
          </button>
        </div>
      </div>

      {/* 1. Header with banner, avatar, action buttons, and bio */}
      <Header
        banner={data.banner}
        avatar={data.avatar}
        name={data.name}
        bio={data.bio}
        onOpenQr={() => setIsQrOpen(true)}
      />

      <div className="biosite-body pb-12">
        {/* 2. Video Card */}
        {data.video && (
          <VideoCard
            title={data.video.title}
            poster={data.video.poster}
            name={data.name}
            onPlay={() => setIsVideoOpen(true)}
          />
        )}

        {/* 3. Featured Product banner */}
        {data.produtos && (
          <FeaturedProduct
            title={data.produtos.title}
            image={data.produtos.image}
            url={data.produtos.url}
          />
        )}

        {/* 4. Products Catalog (4 or 6 items) */}
        {data.catalogo && (
          <CatalogSection
            title={data.catalogo.title}
            items={data.catalogo.items}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        )}

        {/* 5. Main Bio Links Grid */}
        <LinksGrid
          title={data.linksTitulo}
          links={data.links}
          onOpenInfo={handleOpenInfo}
        />

        {/* 6. Agency Services Section (if defined) */}
        {data.servicos && (
          <ServicesSection
            title={data.servicos.title}
            text={data.servicos.text}
            items={data.servicos.items}
            onOpenInfo={handleOpenInfo}
          />
        )}

        {/* 7. Virtual Attendant / Chat Assistant */}
        <ChatAssistant data={data} />

        {/* 8. Google Maps Section */}
        {data.mapa && (
          <MapSection
            embedUrl={data.mapa.embed}
            linkUrl={data.mapa.link}
            title={data.mapa.title}
          />
        )}

        {/* 9. Footer */}
        <Footer
          footerText={data.footer}
          local={data.contato.local}
          telefone={data.contato.telefone}
          email={data.contato.email}
        />
      </div>

      {/* Interactive Modals */}
      {data.video && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          title={data.video.title}
          videoUrl={data.video.url}
        />
      )}

      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={() => setInfoModal((prev) => ({ ...prev, isOpen: false }))}
        title={infoModal.title}
        description={infoModal.description}
        isService={infoModal.isService}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title={data.name}
      />
    </main>
  );
}
