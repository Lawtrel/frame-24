"use client";
import {BarChart2, Clapperboard, DollarSign, ShoppingBag, Ticket, Users,} from "lucide-react";
import React, {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

const MODULES = [
    {
        id: 1,
        title: "Vendas & Ticketing",
        description:
            "Gestão completa de bilheteria, vendas online e terminais de autoatendimento.",
        icon: Ticket,
        position: "top-[15%] left-[20%]",
    },
    {
        id: 2,
        title: "Bomboniere",
        description:
            "Controle de estoque, fluxo de vendas e integração com fornecedores.",
        icon: ShoppingBag,
        position: "top-[15%] right-[15%]",
    },
    {
        id: 3,
        title: "Programação",
        description:
            "Planejamento de sessões com arrasto e solte, e integração direta com distribuidoras.",
        icon: Clapperboard,
        position: "bottom-[20%] right-[25%]",
    },
    {
        id: 4,
        title: "Analytics",
        description:
            "Relatórios estratégicos e insights de desempenho em tempo real.",
        icon: BarChart2,
        position: "bottom-[20%] left-[25%]",
    },
    {
        id: 5,
        title: "Financeiro",
        description:
            "Gestão de fluxo de caixa, automação de contas e conciliação bancária.",
        icon: DollarSign,
        position: "top-[55%] left-[5%]",
    },
    {
        id: 6,
        title: "Fidelidade",
        description:
            "Gerencie clubes, pontos e campanhas de engajamento personalizadas.",
        icon: Users,
        position: "bottom-[45%] right-[5%]",
    },
];

const FeaturesSection = () => {
    const [hoveredModuleId, setHoveredModuleId] = useState<number | null>(null);
    const activeModule = MODULES.find((m) => m.id === hoveredModuleId);

    return (
        <section className="py-28 md:py-40 bg-gray-950 text-white relative overflow-hidden">

            <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(-6px); }
                  50% { transform: translateY(6px); }
                }
                .animate-float {
                  animation: float 8s ease-in-out infinite;
                }
            `}</style>

            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15),_transparent_60%)] pointer-events-none"></div>
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
                            bg-[size:40px_40px] opacity-50 animate-[pan_120s_linear_infinite] [mask-image:radial-gradient(1000px_at_center,white,transparent)]">
                <style>{`
                    @keyframes pan { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
                `}</style>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    Operações Sincronizadas, Resultados Exponenciais
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-20">
                    Cada módulo do ecossistema <span className="text-red-500 font-semibold">Frame24 ERP </span>
                    atua em sinergia total — conectando bilheteria, estoque, programação e análise de desempenho.
                </p>

                <div className="relative h-[640px] w-full mx-auto max-w-5xl">

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 bg-red-900/10 rounded-full border border-red-700/40 backdrop-blur-md
                            shadow-[0_0_80px_-10px_rgba(255,0,0,0.3)] relative flex flex-col items-center justify-center
                            transition-all duration-300">

                            <div
                                className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse-slow"></div>

                            <AnimatePresence mode="wait">
                                {activeModule ? (
                                    <motion.div
                                        key={activeModule.id}
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.9}}
                                        transition={{duration: 0.2}}
                                        className="flex flex-col items-center justify-center p-6 text-center"
                                    >
                                        <activeModule.icon className="w-10 h-10 text-red-400 mb-3"/>
                                        <h3 className="text-xl font-semibold text-gray-100 mb-1">
                                            {activeModule.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-snug">
                                            {activeModule.description}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="hub"
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.9}}
                                        transition={{duration: 0.2}}
                                        className="flex flex-col items-center justify-center"
                                    >
                                        <span className="text-3xl font-bold text-gray-200 tracking-wide">
                                          ERP Hub
                                        </span>
                                        <span className="text-sm text-red-400 uppercase tracking-wider mt-1">
                                          Core Integrado
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {MODULES.map((module) => (
                        <FeatureModule
                            key={module.id}
                            module={module}
                            setHoveredModuleId={setHoveredModuleId}
                            isActive={module.id === hoveredModuleId}
                            isAnyActive={hoveredModuleId !== null}
                        />
                    ))}
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
    isAnyActive: boolean;
}

const FeatureModule: React.FC<FeatureModuleProps> = ({
                                                         module,
                                                         setHoveredModuleId,
                                                         isActive,
                                                         isAnyActive,
                                                     }) => {
    const IconComponent = module.icon;

    return (
        <div
            className={`absolute ${module.position} animate-float cursor-pointer z-20`}
            onMouseEnter={() => setHoveredModuleId(module.id)}
            onMouseLeave={() => setHoveredModuleId(null)}
        >
            <div
                className={`w-28 h-28 flex flex-col items-center justify-center rounded-full border-2 
                    backdrop-blur-md bg-gray-900/70 shadow-lg 
                    transition-all duration-300
                    ${
                    isActive
                        ? "border-red-600 shadow-red-600/40 bg-gray-900/90 scale-125"
                        : isAnyActive
                            ? "border-gray-700 opacity-50 grayscale"
                            : "border-gray-700 hover:border-red-600/50 hover:scale-110"
                }`}
            >
                <IconComponent
                    className={`w-8 h-8 mb-1 transition-colors duration-300 ${
                        isActive ? "text-red-500" : "text-gray-400"
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

            {isActive && (
                <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse -z-10"></div>
            )}
        </div>
    );
};

export default FeaturesSection;