"use client";
import {
    Ticket,
    ShoppingBag,
    Clapperboard,
    BarChart2,
    DollarSign,
    Users,
} from "lucide-react";
import React, { useState } from "react";

const MODULES = [
    {
        id: 1,
        title: "Vendas & Ticketing",
        description:
            "Gestão completa de bilheteria, vendas online e terminais de autoatendimento.",
        icon: Ticket,
        position: "top-12 left-1/4",
    },
    {
        id: 2,
        title: "Bomboniere",
        description:
            "Controle de estoque, fluxo de vendas e integração com fornecedores.",
        icon: ShoppingBag,
        position: "top-1/4 right-12",
    },
    {
        id: 3,
        title: "Programação",
        description:
            "Planejamento de sessões com arrasto e solte, e integração direta com distribuidoras.",
        icon: Clapperboard,
        position: "bottom-12 right-1/4",
    },
    {
        id: 4,
        title: "Analytics",
        description:
            "Relatórios estratégicos e insights de desempenho em tempo real.",
        icon: BarChart2,
        position: "bottom-1/4 left-12",
    },
    {
        id: 5,
        title: "Financeiro",
        description:
            "Gestão de fluxo de caixa, automação de contas e conciliação bancária.",
        icon: DollarSign,
        position: "top-1/3 left-12",
    },
    {
        id: 6,
        title: "Fidelidade",
        description:
            "Gerencie clubes, pontos e campanhas de engajamento personalizadas.",
        icon: Users,
        position: "bottom-1/3 right-12",
    },
];

const FeaturesSection = () => {
    const [hoveredModuleId, setHoveredModuleId] = useState<number | null>(null);
    const activeModule = MODULES.find((m) => m.id === hoveredModuleId);

    return (
        <section className="py-28 md:py-40 bg-gray-950 text-white relative overflow-hidden">
            {/* Fundo Dinâmico */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15),_transparent_70%)] pointer-events-none"></div>

            {/* Container Principal */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    Operações Sincronizadas, Resultados Exponenciais
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-20">
                    Cada módulo do ecossistema <span className="text-red-500 font-semibold">Frame24 ERP</span>
                    atua em sinergia total — conectando bilheteria, estoque, programação e análise de desempenho.
                </p>

                {/* Orbital System */}
                <div className="relative h-[640px] w-full mx-auto max-w-5xl">
                    {/* Núcleo Central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-60 h-60 bg-red-700/10 rounded-full border border-red-700/40 backdrop-blur-sm
                            shadow-[0_0_80px_-10px_rgba(255,0,0,0.2)] relative flex flex-col items-center justify-center animate-pulse">
              <span className="text-2xl font-bold text-gray-200 tracking-wide">
                ERP Hub
              </span>
                            <span className="text-xs text-red-400 uppercase tracking-wider mt-1">
                Core Integrado
              </span>

                            {/* Brilho interno animado */}
                            <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse-slow"></div>
                        </div>
                    </div>

                    {/* Módulos orbitais */}
                    {MODULES.map((module) => (
                        <FeatureModule
                            key={module.id}
                            module={module}
                            setHoveredModuleId={setHoveredModuleId}
                            isActive={module.id === hoveredModuleId}
                        />
                    ))}

                    {/* Tooltip de destaque */}
                    {activeModule && (
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                         bg-gray-900/95 border border-red-600/40 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,0,0,0.3)]
                         p-6 w-96 backdrop-blur-lg transition-all duration-300"
                        >
                            <h3 className="text-xl font-semibold text-red-400 mb-2">
                                {activeModule.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {activeModule.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

interface ModuleData {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    position: string;
}

interface FeatureModuleProps {
    module: ModuleData;
    setHoveredModuleId: (id: number | null) => void;
    isActive: boolean;
}

const FeatureModule: React.FC<FeatureModuleProps> = ({
                                                         module,
                                                         setHoveredModuleId,
                                                         isActive,
                                                     }) => {
    const IconComponent = module.icon;

    return (
        <div
            className={`absolute ${module.position} transition-transform duration-500 ease-out 
                  cursor-pointer ${isActive ? "scale-125" : "hover:scale-110"}`}
            onMouseEnter={() => setHoveredModuleId(module.id)}
            onMouseLeave={() => setHoveredModuleId(null)}
        >
            <div
                className={`w-28 h-28 flex flex-col items-center justify-center rounded-full border-2 
                    backdrop-blur-md bg-gray-900/70 shadow-lg transition-all duration-300
                    ${
                    isActive
                        ? "border-red-600 shadow-red-600/40 bg-gray-900/90"
                        : "border-gray-700 hover:border-red-600/50"
                }`}
            >
                <IconComponent
                    className={`w-8 h-8 mb-1 transition-colors duration-300 ${
                        isActive ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                />
                <span
                    className={`text-xs font-semibold tracking-wide ${
                        isActive ? "text-red-300" : "text-gray-300"
                    }`}
                >
          {module.title.split(" ")[0]}
        </span>
            </div>

            {/* Glow animado ao hover */}
            {isActive && (
                <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse"></div>
            )}
        </div>
    );
};

export default FeaturesSection;
