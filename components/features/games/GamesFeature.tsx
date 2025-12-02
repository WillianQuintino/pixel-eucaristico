import Image from "next/image";
import Link from "next/link";

export default function GamesFeature() {
  return (
    <div className="flex flex-col gap-8 py-10 px-4 md:px-0 flavor-games">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-accent">Games</h1>
        <p className="text-lg md:text-xl">Jogos que evangelizam e divertem.</p>
      </div>

      {/* Featured Game */}
      <div className="card lg:card-side bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none overflow-hidden text-base-content">
        <figure className="lg:w-1/3 bg-games-tint p-8 flex items-center justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-base-content">
             <div className="relative w-48 h-48">
                <Image
                    src="/logos/nano_banana_saint.png"
                    alt="Nano Banana Saint"
                    fill
                    className="object-contain"
                />
            </div>
        </figure>
        <div className="card-body p-6 md:p-8">
          <h2 className="card-title text-2xl mb-4">História do Santo Carlos Acutis</h2>
          <div className="badge badge-accent badge-outline rounded-none mb-4">Em Pesquisa</div>
          <p className="mb-4 text-base md:text-lg">
            Este projeto está em fase de pesquisa dos livros e referências para poder criar o GDD (Game Design Document) do projeto.
            Em breve, uma aventura emocionante sobre a vida do padroeiro da internet.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-accent border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none w-full md:w-auto" disabled>
              Em Breve
            </button>
          </div>
        </div>
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
