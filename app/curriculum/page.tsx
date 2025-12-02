import Link from "next/link";

export default function Curriculum() {
  return (
    <div className="flex flex-col gap-8 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Curriculum Vitae</h1>
        <p className="text-xl">Conheça minha trajetória profissional.</p>
      </div>

      {/* PDF Viewer / Download Section */}
      <div className="card bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] rounded-none p-8 text-base-content">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Willian Quintino</h2>
            <p className="mb-2 text-lg">Desenvolvedor Full Stack & Criador do Pixel Eucarístico</p>
            <p className="mb-4 text-sm opacity-80">
                williancustodioquintino@gmail.com • (19) 99226-4821
            </p>
            <div className="flex justify-center gap-4">
                <a href="https://www.linkedin.com/in/willian-quintino" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm border-2 border-base-content rounded-none">
                    LinkedIn
                </a>
                <a href="https://github.com/willianquintino" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm border-2 border-base-content rounded-none">
                    GitHub
                </a>
                <a href="mailto:williancustodioquintino@gmail.com" className="btn btn-accent btn-sm border-2 border-base-content rounded-none">
                    Email
                </a>
            </div>
        </div>

        <div className="divider"></div>

        {/* Skills Section */}
        <div className="mb-8 text-left">
            <h3 className="text-xl font-bold mb-4 text-accent">Habilidades Técnicas</h3>
            <div className="flex flex-wrap gap-2">
                <span className="badge badge-outline badge-lg rounded-none border-2">Next.js</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">React</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">TypeScript</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">Node.js</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">Tailwind CSS</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">DaisyUI</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">Git</span>
                <span className="badge badge-outline badge-lg rounded-none border-2">SQL</span>
            </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8 text-left">
            <h3 className="text-xl font-bold mb-4 text-secondary">Experiência</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>Desenvolvimento de aplicações web modernas com Next.js e React.</li>
                <li>Criação de APIs RESTful e integração com serviços externos.</li>
                <li>Implementação de designs responsivos e acessíveis.</li>
                <li>Gestão de projetos e versionamento de código com Git.</li>
            </ul>
        </div>

        <div className="divider"></div>

        <div className="flex flex-col items-center gap-4">
            <p className="text-lg">Visualize ou baixe o currículo completo em PDF:</p>
            <div className="tooltip" data-tip="Baixar PDF">
                <a 
                    href="/Curriculum/Linkedin.pdf" 
                    target="_blank" 
                    className="btn btn-accent btn-lg border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar PDF
                </a>
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
