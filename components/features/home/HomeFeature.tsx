import Image from "next/image";
import Link from "next/link";

export default function HomeFeature() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-12 py-10 relative overflow-hidden flavor-landing">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-primary animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-secondary animate-spin"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-accent animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="hero bg-base-100/80 backdrop-blur-sm border-4 border-base-content p-6 md:p-10 shadow-[8px_8px_0_0_currentColor] md:shadow-[12px_12px_0_0_currentColor] text-base-content max-w-5xl w-full relative group hover:translate-y-[-2px] transition-all duration-300">
        <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center">
          
          {/* Hero Image */}
          <div className="relative w-64 h-64 lg:w-96 lg:h-96 border-4 border-base-content bg-base-100 p-4 shadow-[8px_8px_0_0_currentColor] rotate-3 group-hover:rotate-0 transition-all duration-500">
            <Image
              src="/logos/pixel-eucaristico---software-e-games.png"
              alt="Pixel Eucarístico Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Hero Text */}
          <div className="text-center lg:text-left max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary drop-shadow-[4px_4px_0_currentColor] leading-tight">
              Pixel <br/> <span className="text-secondary">Eucarístico</span>
            </h1>
            <p className="py-6 text-lg md:text-xl lg:text-2xl leading-relaxed">
              Onde a <span className="text-accent font-bold">Fé</span> encontra a <span className="text-info font-bold">Tecnologia</span>.
              <br/>
              Desenvolvendo jogos e softwares com propósito e valores cristãos.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start mt-4">
              <Link href="/games" className="btn btn-primary btn-lg border-4 border-base-content shadow-[4px_4px_0_0_currentColor] md:shadow-[6px_6px_0_0_currentColor] hover:translate-y-1 hover:shadow-[2px_2px_0_0_currentColor] transition-all rounded-none text-lg md:text-xl w-full md:w-auto">
                🎮 Games
              </Link>
              <Link href="/software" className="btn btn-secondary btn-lg border-4 border-base-content shadow-[4px_4px_0_0_currentColor] md:shadow-[6px_6px_0_0_currentColor] hover:translate-y-1 hover:shadow-[2px_2px_0_0_currentColor] transition-all rounded-none text-lg md:text-xl w-full md:w-auto">
                💻 Software
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl mt-8 px-4 md:px-0">
        
        {/* Games Card */}
        <Link href="/games" className="group w-full">
            <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[12px_12px_0_0_currentColor] hover:translate-y-[-4px] transition-all duration-300 rounded-none h-full overflow-hidden text-base-content">
                <div className="bg-[#dbdbdc] p-8 flex justify-center border-b-4 border-base-content group-hover:opacity-90 transition-opacity">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 transform group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src="/logos/pixel-eucaristico---games.png"
                            alt="Games Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="card-body items-center text-center p-6 md:p-8">
                    <h2 className="card-title text-2xl md:text-3xl mb-2 group-hover:text-primary transition-colors">Games</h2>
                    <p className="text-base md:text-lg">Divirta-se com aventuras emocionantes que evangelizam.</p>
                    <div className="card-actions mt-4">
                        <span className="btn btn-ghost border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none group-hover:bg-primary group-hover:text-primary-content w-full md:w-auto">Explorar Games →</span>
                    </div>
                </div>
            </div>
        </Link>

        {/* Software Card */}
        <Link href="/software" className="group w-full">
            <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[12px_12px_0_0_currentColor] hover:translate-y-[-4px] transition-all duration-300 rounded-none h-full overflow-hidden text-base-content">
                <div className="bg-[#151832] p-8 flex justify-center border-b-4 border-base-content group-hover:opacity-90 transition-opacity">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 transform group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src="/logos/pixel-eucaristico---software.png"
                            alt="Software Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="card-body items-center text-center p-6 md:p-8">
                    <h2 className="card-title text-2xl md:text-3xl mb-2 group-hover:text-secondary transition-colors">Software</h2>
                    <p className="text-base md:text-lg">Soluções tecnológicas inovadoras para o dia a dia.</p>
                    <div className="card-actions mt-4">
                        <span className="btn btn-ghost border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none group-hover:bg-secondary group-hover:text-secondary-content w-full md:w-auto">Explorar Software →</span>
                    </div>
                </div>
            </div>
        </Link>

      </div>
    </div>
  );
}
