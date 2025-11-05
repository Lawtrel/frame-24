"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Link from "next/link";
import axios from "axios";

type Step = 1 | 2 | 3;

interface CompanyData {
    corporate_name: string;
    trade_name: string;
    cnpj: string;
    ibge_municipality_code: string;
}

interface AdminData {
    admin_name: string;
    admin_cpf: string;
    admin_email: string;
    admin_password: string;
}

export default function RegisterTenantPage() {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [companyData, setCompanyData] = useState<CompanyData>({
        corporate_name: "",
        trade_name: "",
        cnpj: "",
        ibge_municipality_code: "",
    });

    const [adminData, setAdminData] = useState<AdminData>({
        admin_name: "",
        admin_cpf: "",
        admin_email: "",
        admin_password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: "company" | "admin"
    ) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "cnpj") formattedValue = value.replace(/\D/g, "").slice(0, 14);
        if (name === "admin_cpf") formattedValue = value.replace(/\D/g, "").slice(0, 11);
        if (name === "ibge_municipality_code")
            formattedValue = value.replace(/\D/g, "").slice(0, 7);

        if (section === "company") setCompanyData({ ...companyData, [name]: formattedValue });
        else setAdminData({ ...adminData, [name]: formattedValue });

        if (error) setError(null);
    };

    const nextStep = () => {
        if (step === 1) {
            if (!companyData.corporate_name || !companyData.cnpj || !companyData.ibge_municipality_code) {
                setError("Preencha todos os campos obrigatórios da empresa.");
                return;
            }
        }
        if (step === 2) {
            if (!adminData.admin_name || !adminData.admin_cpf || !adminData.admin_email || !adminData.admin_password) {
                setError("Preencha todos os campos obrigatórios do administrador.");
                return;
            }
            if (adminData.admin_password.length < 8) {
                setError("A senha deve ter no mínimo 8 caracteres.");
                return;
            }
        }
        setStep((prev) => (prev < 3 ? (prev + 1) as Step : prev));
    };

    const prevStep = () => setStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = { ...companyData, ...adminData };
            const response = await axios.post("http://localhost:3002/api/companies", payload, {
                headers: { "Content-Type": "application/json" },
            });
            localStorage.setItem("session-token", response.data.token);
            alert("Empresa cadastrada com sucesso!");
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro inesperado ao cadastrar empresa.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">

            {/* Header simplificado */}
            <header className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md font-semibold"
                    >
                        Voltar para Home
                    </Link>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
                <div className="bg-gray-900/90 border border-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">

                    {/* Progresso */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {["Empresa", "Administrador", "Revisão"].map((label, idx) => (
                                <div key={idx} className="flex-1 text-center text-sm font-semibold">
                  <span
                      className={`inline-block w-8 h-8 leading-8 rounded-full ${
                          step > idx ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400"
                      } transition-all duration-300`}
                  >
                    {idx + 1}
                  </span>
                                    <div className="mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full relative">
                            <div
                                className="h-2 bg-red-600 rounded-full transition-all duration-500"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <Input
                                    label="Razão Social"
                                    name="corporate_name"
                                    value={companyData.corporate_name}
                                    onChange={(e) => handleChange(e, "company")}
                                    required
                                />
                                <Input
                                    label="Nome Fantasia"
                                    name="trade_name"
                                    value={companyData.trade_name}
                                    onChange={(e) => handleChange(e, "company")}
                                />
                                <Input
                                    label="CNPJ"
                                    name="cnpj"
                                    value={companyData.cnpj}
                                    onChange={(e) => handleChange(e, "company")}
                                    required
                                />
                                <Input
                                    label="Código IBGE do Município"
                                    name="ibge_municipality_code"
                                    value={companyData.ibge_municipality_code}
                                    onChange={(e) => handleChange(e, "company")}
                                    required
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <Input
                                    label="Nome do Administrador"
                                    name="admin_name"
                                    value={adminData.admin_name}
                                    onChange={(e) => handleChange(e, "admin")}
                                    required
                                />
                                <Input
                                    label="CPF"
                                    name="admin_cpf"
                                    value={adminData.admin_cpf}
                                    onChange={(e) => handleChange(e, "admin")}
                                    required
                                />
                                <Input
                                    label="Email"
                                    name="admin_email"
                                    type="email"
                                    value={adminData.admin_email}
                                    onChange={(e) => handleChange(e, "admin")}
                                    required
                                />
                                <Input
                                    label="Senha (mín. 8 caracteres)"
                                    name="admin_password"
                                    type="password"
                                    value={adminData.admin_password}
                                    onChange={(e) => handleChange(e, "admin")}
                                    required
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-3 text-sm">
                                <h3 className="font-semibold text-gray-300 mb-2">📋 Revisão de Dados</h3>
                                <div className="border border-gray-700 rounded-lg p-4 bg-gray-950">
                                    <p><span className="text-gray-400">Empresa:</span> {companyData.corporate_name}</p>
                                    <p><span className="text-gray-400">CNPJ:</span> {companyData.cnpj}</p>
                                    <p><span className="text-gray-400">Município IBGE:</span> {companyData.ibge_municipality_code}</p>
                                    <hr className="my-3 border-gray-700" />
                                    <p><span className="text-gray-400">Administrador:</span> {adminData.admin_name}</p>
                                    <p><span className="text-gray-400">Email:</span> {adminData.admin_email}</p>
                                    <p><span className="text-gray-400">CPF:</span> {adminData.admin_cpf}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-6">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition"
                                >
                                    Voltar
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-auto px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md font-semibold transition shadow-md"
                                >
                                    Próximo
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`ml-auto px-5 py-2 rounded-md font-semibold transition shadow-md ${
                                        loading
                                            ? "bg-red-800 opacity-70 cursor-not-allowed"
                                            : "bg-red-700 hover:bg-red-600 text-white"
                                    }`}
                                >
                                    {loading ? "Enviando..." : "Concluir Cadastro"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
