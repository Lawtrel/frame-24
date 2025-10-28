import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
    {
        name: "Essencial",
        price: "R$ 499",
        perks: "Por cinema/mês",
        description:
            "Ideal para cinemas independentes e redes pequenas que precisam de estabilidade.",
        features: [
            "Ticketing Essencial (Até 2 caixas)",
            "Gestão de Inventário de Bomboniere",
            "Relatórios de Vendas Básicos",
            "Suporte por Email (SLA 24h)",
            "Usuários Ilimitados",
        ],
        isRecommended: false,
        cta: "Iniciar Teste Essencial",
    },
    {
        name: "Multiplex",
        price: "R$ 899",
        perks: "Por cinema/mês",
        description:
            "Plano completo para redes com múltiplas salas. Otimização e controle total.",
        features: [
            "Todos os recursos Essenciais",
            "Programação de Filmes Inteligente",
            "Dashboard de BI em Tempo Real",
            "Gestão de Fidelidade e Promoções",
            "Integração Fiscal Avançada (NFe)",
        ],
        isRecommended: true,
        cta: "Começar o Multiplex PRO",
    },
    {
        name: "Enterprise",
        price: "Fale Conosco",
        perks: "Customizado",
        description:
            "Solução customizada para grandes cadeias com requisitos complexos.",
        features: [
            "Todos os recursos Multiplex",
            "Suporte 24/7 Dedicado (SLA 1h)",
            "Integração com Sistemas Legados",
            "Personalização de Layouts e APIs",
            "Consultoria Estratégica Mensal",
        ],
        isRecommended: false,
        cta: "Solicitar Demonstração",
    },
];

const PricingSection = () => {
    return (
        <section id="planos" className="py-28 md:py-36 bg-gray-950 text-white relative overflow-hidden">
            {/* Background Gradiente Corporativo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Cabeçalho */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-red-600 to-red-400 text-transparent bg-clip-text">
                        Planos que Evoluem com o Seu Cinema
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Flexibilidade, escalabilidade e suporte corporativo em cada etapa do seu crescimento.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col p-8 rounded-2xl transition-all duration-300 relative border
                ${plan.isRecommended
                                ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-red-600 shadow-[0_0_40px_-10px_rgba(255,0,0,0.4)] scale-105"
                                : "bg-gray-900/90 border-gray-700 hover:border-gray-600 hover:shadow-[0_0_30px_-10px_rgba(255,0,0,0.2)]"
                            }`}
                        >
                            {/* Badge de destaque */}
                            {plan.isRecommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-full shadow-lg">
                    Mais Popular
                  </span>
                                </div>
                            )}

                            {/* Conteúdo */}
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white text-center">{plan.name}</h3>
                                <div className="mt-6 text-center">
                                    <p className="text-5xl font-extrabold text-white">{plan.price}</p>
                                    <p className="mt-1 text-gray-400 text-sm">{plan.perks}</p>
                                </div>

                                <p className="mt-6 text-gray-300 text-sm text-center leading-relaxed">
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <ul className="mt-8 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botão */}
                            <Link
                                href="/register-tenant"
                                className={`mt-10 block w-full text-center px-4 py-3 rounded-lg font-semibold transition-all duration-200
                  ${plan.isRecommended
                                    ? "bg-red-700 hover:bg-red-600 text-white shadow-red-600/40 shadow-lg"
                                    : "bg-gray-800 hover:bg-gray-700 text-white"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* CTA Inferior */}
                <div className="mt-20 text-center">
                    <p className="text-gray-400">
                        Ainda em dúvida?
                        <Link href="#" className="text-red-500 hover:underline font-semibold ml-1">
                            Fale com um especialista.
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
