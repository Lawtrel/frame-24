import Link from 'next/link';

const HeroSection = () => {
    return (
        <section
            className="relative overflow-hidden pt-24 pb-32 bg-gray-950
                       bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900
                       border-b border-gray-800">

            {/* Container */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-center">

                    {/* COLUNA ESQUERDA */}
                    <div className="lg:col-span-6 xl:col-span-5 text-center lg:text-left space-y-8">

                        {/* Selo */}
                        <div className="inline-flex items-center space-x-2 bg-red-600/10 px-4 py-2 rounded-full border border-red-600/30">
                            <span className="text-red-500 font-semibold text-sm tracking-wide">
                                ERP PARA CINEMAS
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-100">
                            Domine a Gestão do Seu Multiplex
                        </h1>

                        {/* Subheadline */}
                        <h2 className="text-2xl font-semibold text-red-500 tracking-tight">
                            Redefina eficiência. Amplie margens. Simplifique operações.
                        </h2>

                        {/* Descritivo */}
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Uma plataforma única para controle total de bilheteria, estoque, programação
                            e relatórios financeiros — com dashboards analíticos em tempo real.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                            <Link
                                href="/register-tenant"
                                className="px-8 py-3 rounded-full font-semibold text-white
                                           bg-gradient-to-r from-red-600 to-red-500
                                           hover:from-red-500 hover:to-red-400
                                           shadow-lg shadow-red-900/40 transform hover:scale-105
                                           transition-all duration-300"
                            >
                                Solicitar Demonstração
                            </Link>

                            <Link
                                href="#planos"
                                className="px-8 py-3 rounded-full font-semibold text-gray-100
                                           border-2 border-gray-400 hover:border-red-500
                                           hover:text-red-500 transition-all duration-300
                                           transform hover:scale-105"
                            >
                                Consultar Planos
                            </Link>
                        </div>
                    </div>

                    {/* COLUNA DIREITA */}
                    <div className="mt-20 lg:mt-0 lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end relative">

                        {/* Aura */}
                        <div className="absolute inset-x-1/4 top-1/4 h-2/3 -z-10
                                        bg-red-600/20 rounded-full blur-3xl opacity-60"></div>

                        {/* Mockups */}
                        <div className="relative w-full max-w-2xl h-[520px] lg:h-[620px]">

                            {/* Desktop */}
                            <div className="absolute top-0 left-0 w-3/4 transform -rotate-6
                                            shadow-2xl shadow-red-900/40 hover:rotate-0 transition-transform duration-700">
                                <div className="aspect-video bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                                    <span className="block w-full h-full bg-gradient-to-br from-red-900/10 via-gray-900 to-gray-950
                                                     flex items-center justify-center text-sm text-gray-400 font-medium">
                                        [Dashboard Analytics – KPIs em Tempo Real]
                                    </span>
                                </div>
                            </div>

                            {/* Tablet */}
                            <div className="absolute top-1/3 right-0 w-1/3 transform rotate-12 scale-95
                                            shadow-2xl shadow-red-900/30 hover:rotate-0 transition-transform duration-700 delay-100">
                                <div className="aspect-[4/3] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                                    <span className="block w-full h-full bg-gradient-to-br from-red-800/10 via-gray-900 to-gray-950
                                                     flex items-center justify-center text-xs text-gray-400 font-medium">
                                        [Gestão de Sessões e Programação]
                                    </span>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="absolute bottom-4 right-1/4 w-1/4 transform scale-110
                                            shadow-2xl shadow-red-900/50 hover:scale-125 transition-transform duration-700 delay-200">
                                <div className="aspect-[9/16] bg-gray-900 border-4 border-gray-700 rounded-2xl overflow-hidden">
                                    <span className="block w-full h-full bg-gradient-to-b from-red-900/20 via-gray-900 to-gray-950
                                                     flex items-center justify-center text-xs text-gray-400 font-medium">
                                        [App de Vendas e Check-in]
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Fundo decorativo */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,_rgba(239,68,68,0.2),_transparent_70%)]"></div>
        </section>
    );
};

export default HeroSection;
