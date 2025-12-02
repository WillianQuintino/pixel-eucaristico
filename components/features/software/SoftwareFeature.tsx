import Image from "next/image";
import Link from "next/link";

export default function SoftwareFeature() {
  return (
    <div className="flex flex-col gap-8 py-10 px-4 md:px-0 flavor-software">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-info">Software</h1>
        <p className="text-lg md:text-xl">Soluções tecnológicas com propósito.</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Project 1: Mass Diária */}
        <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none hover:translate-y-[-4px] transition-transform overflow-hidden text-base-content">
          <figure className="relative h-48 w-full border-b-4 border-base-content bg-software-tint">
            <img src="/videos/mass_diaria_showcase.webp" alt="Mass Diária Showcase" className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl text-info">Mass Diária</h2>
            <p>Aplicativo para acompanhamento da liturgia diária.</p>
            <div className="card-actions justify-end mt-4 flex-col gap-2">
               <a href="https://mass-diaria.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm border-2 border-base-content rounded-none w-full">Ver Projeto</a>
               <a href="https://github.com/Pixel-Eucaristico/mass-diaria" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm border-2 border-base-content rounded-none w-full">Ver Git</a>
            </div>
          </div>
        </div>

        {/* Project 2: Recanto */}
        <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none hover:translate-y-[-4px] transition-transform overflow-hidden text-base-content">
          <figure className="relative h-48 w-full border-b-4 border-base-content bg-software-tint">
            <img src="/videos/recanto_showcase.webp" alt="Recanto Showcase" className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl text-info">Recanto</h2>
            <p>Sistema para gerenciar, formar e organizar comunidades.</p>
            <div className="card-actions justify-end mt-4 flex-col gap-2">
               <a href="https://recanto-app.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm border-2 border-base-content rounded-none w-full">Ver Projeto</a>
               <a href="https://github.com/Pixel-Eucaristico/recanto" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm border-2 border-base-content rounded-none w-full">Ver Git</a>
            </div>
          </div>
        </div>

        {/* Project 3: wwebjs-rest-api */}
        <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none hover:translate-y-[-4px] transition-transform text-base-content overflow-hidden">
          <figure className="relative h-48 w-full border-b-4 border-base-content bg-software-tint">
            <img src="/logos/wwebjs_api.png" alt="wwebjs-rest-api Showcase" className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl text-info">wwebjs-rest-api</h2>
            <p>API REST para integração com WhatsApp Web.</p>
            <div className="card-actions justify-end mt-4 flex-col gap-2">
               <a href="https://github.com/Pixel-Eucaristico/wwebjs-rest-api" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm border-2 border-base-content rounded-none w-full">Ver Código (Git)</a>
            </div>
          </div>
        </div>

        {/* Project 4: Alaska */}
        <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none hover:translate-y-[-4px] transition-transform overflow-hidden text-base-content">
          <figure className="relative h-48 w-full border-b-4 border-base-content bg-software-tint">
            <img src="/videos/alaska_showcase.webp" alt="Alaska Showcase" className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl text-info">Alaska</h2>
            <p>Site de amostra para cliente.</p>
            <div className="card-actions justify-end mt-4 flex-col gap-2">
               <a href="https://alaska-sigma.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm border-2 border-base-content rounded-none w-full">Ver Projeto</a>
               <a href="https://github.com/Pixel-Eucaristico/alaska-amostra" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm border-2 border-base-content rounded-none w-full">Ver Git</a>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Showcase Section */}
      <div className="mt-12 p-8 border-4 border-base-content bg-base-200 rounded-none relative overflow-hidden group text-base-content">
        <h2 className="text-2xl font-bold mb-6 text-center">Showcase de Animações</h2>
        
        <div className="flex justify-center gap-8 flex-wrap">
            {/* Bouncing Ball */}
            <div className="w-16 h-16 bg-primary border-2 border-base-content animate-bounce flex items-center justify-center text-primary-content font-bold shadow-[4px_4px_0_0_currentColor]">
                8-BIT
            </div>

            {/* Spinning Square */}
            <div className="w-16 h-16 bg-secondary border-2 border-base-content animate-spin flex items-center justify-center text-secondary-content font-bold shadow-[4px_4px_0_0_currentColor]">
                PIXEL
            </div>

            {/* Pulse Circle */}
            <div className="w-16 h-16 bg-accent border-2 border-base-content animate-pulse rounded-full flex items-center justify-center text-accent-content font-bold shadow-[4px_4px_0_0_currentColor]">
                DEV
            </div>
        </div>
        
        <p className="text-center mt-8 text-sm opacity-70">
            * Estas animações são renderizadas com CSS puro e Tailwind.
        </p>
      </div>

      {/* Back Button */}
      <div className="text-center mt-8">
        <Link href="/" className="btn btn-ghost hover:bg-transparent hover:underline">
          ← Voltar para Home
        </Link>
      </div>
    </div>
  );
}
