import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col gap-12 py-10 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Sobre Nós</h1>
        <p className="text-xl">A história e a missão da Pixel Eucarístico.</p>
      </div>

      {/* Origin Story Section */}
      <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none overflow-hidden text-base-content">
        <div className="card-body p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="text-4xl">🙏</span> Nossa Inspiração
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="w-full md:w-1/3 relative h-80 border-4 border-base-content bg-base-200 overflow-hidden">
                    <Image 
                        src="/images/rycerz_niepokalanej.jpg" 
                        alt="Capa da revista Rycerz Niepokalanej (Cavaleiro da Imaculada)" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold mb-2 text-secondary">São Maximiliano Kolbe</h3>
                    <p className="text-lg leading-relaxed text-justify">
                        A <strong>Pixel Eucarístico</strong> nasceu de uma inspiração em oração diante do Santíssimo Sacramento. 
                        Olhamos para o exemplo de <strong>São Maximiliano Kolbe</strong>, que revolucionou a evangelização em sua época. 
                        Ele transformou jornais e revistas, como o <em>Cavaleiro da Imaculada</em>, em poderosas ferramentas para levar a Imaculada aos corações. 
                        Seu uso da "mídia de ponta" daquele tempo nos inspira a usar a tecnologia de hoje.
                    </p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-1/3 relative h-80 border-4 border-base-content bg-base-200 overflow-hidden">
                     <Image 
                        src="/images/carlo_acutis_tomb.jpg" 
                        alt="Túmulo do Beato Carlo Acutis em Assis" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold mb-2 text-accent">Beato Carlo Acutis</h3>
                    <p className="text-lg leading-relaxed text-justify">
                        A confirmação de nossa missão veio através do exemplo do <strong>Beato Carlo Acutis</strong>. 
                        Conhecido como o "Padroeiro da Internet", ele uniu sua paixão por computadores e jogos com seu amor pela Eucaristia.
                        Sua vida nos mostra que a santidade é possível na era digital. Ele é o nosso intercessor e modelo: 
                        um jovem que santificou o digital. Assim como ele, queremos usar jogos e softwares para evangelizar a juventude.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-primary/10 p-8 border-l-8 border-primary">
        <h2 className="text-2xl font-bold mb-4 text-primary">Nossa Missão</h2>
        <p className="text-xl italic">
            "Evangelizar através da tecnologia, criando experiências digitais que divertem, formam e aproximam as pessoas de Deus."
        </p>
      </div>

      {/* Curriculum Link */}
      <div className="text-center mt-8">
        <p className="mb-4 text-lg">Quer saber mais sobre quem está por trás deste projeto?</p>
        <Link href="/curriculum" className="btn btn-secondary btn-lg border-4 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none">
          Ver Currículo do Fundador
        </Link>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Link href="/" className="btn btn-ghost hover:bg-transparent hover:underline">
          ← Voltar para Home
        </Link>
      </div>
    </div>
  );
}
