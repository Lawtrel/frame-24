export const contractTypeData = [
    { name: 'CLT', description: 'Consolidação das Leis do Trabalho', display_order: 1 },
    { name: 'PJ', description: 'Pessoa Jurídica', display_order: 2 },
    { name: 'Temporário', description: 'Contrato Temporário', display_order: 3 },
    { name: 'Estágio', description: 'Contrato de Estágio', display_order: 4 },
    { name: 'Terceirizado', description: 'Funcionário Terceirizado', display_order: 5 },
];

export const profileData = [
    // O campo 'code' é crucial para a lógica do sistema (Ex: SUPER_ADMIN)
    { code: 'SUPER_ADMIN', name: 'Super Administrador', description: 'Acesso total e configurações de Tenant/Sistema.', hierarchy_level: 1 },
    { code: 'ADMIN', name: 'Administrador', description: 'Acesso administrativo completo.', hierarchy_level: 2 },
    { code: 'MANAGER', name: 'Gerente', description: 'Acesso gerencial.', hierarchy_level: 3 },
    { code: 'USER', name: 'Usuário', description: 'Acesso básico.', hierarchy_level: 4 },
    { code: 'VIEWER', name: 'Visualizador', description: 'Apenas visualização.', hierarchy_level: 5 },
];

export const revenueTypeData = [
    { name: 'Bilheteria', description: 'Receita de venda de ingressos', applies_iss: true, applies_pis_cofins: true },
    { name: 'Bomboniere', description: 'Receita de venda de produtos', applies_iss: false, applies_pis_cofins: true },
    { name: 'Publicidade', description: 'Receita de publicidade', applies_iss: true, applies_pis_cofins: true },
    { name: 'Aluguel de Sala', description: 'Receita de aluguel', applies_iss: true, applies_pis_cofins: true },
];

export const paymentMethodData = [
    { name: 'Dinheiro', description: 'Pagamento em espécie', operator_fee: 0, settlement_days: 0, display_order: 1 },
    { name: 'Cartão de Crédito', description: 'Pagamento com cartão de crédito', operator_fee: 2.5, settlement_days: 30, display_order: 2 },
    { name: 'Cartão de Débito', description: 'Pagamento com cartão de débito', operator_fee: 1.5, settlement_days: 1, display_order: 3 },
    { name: 'PIX', description: 'Pagamento via PIX', operator_fee: 0.5, settlement_days: 0, display_order: 4 },
];

export const saleTypeData = [
    { name: 'Balcão', description: 'Venda presencial no cinema', convenience_fee: 0, display_order: 1 },
    { name: 'Online', description: 'Venda pelo site/app', convenience_fee: 3.5, display_order: 2 },
    { name: 'Totem', description: 'Venda em totem de autoatendimento', convenience_fee: 1.5, display_order: 3 },
];

export const saleStatusData = [
    { name: 'Pendente', description: 'Venda iniciada mas não finalizada', allows_modification: true, display_order: 1 },
    { name: 'Confirmada', description: 'Venda confirmada e paga', allows_modification: false, display_order: 2 },
    { name: 'Cancelada', description: 'Venda cancelada', allows_modification: false, display_order: 3 },
    { name: 'Reembolsada', description: 'Venda reembolsada', allows_modification: false, display_order: 4 },
];

export const ticketTypeData = [
    { name: 'Inteira', description: 'Ingresso sem desconto', discount_percentage: 0, display_order: 1 },
    { name: 'Meia-entrada', description: 'Ingresso com 50% de desconto', discount_percentage: 50, display_order: 2 },
    { name: 'Cortesia', description: 'Ingresso gratuito', discount_percentage: 100, display_order: 5 },
];

export const ageRatingData = [
    { code: 'L', name: 'Livre', minimum_age: 0, description: 'Livre para todos os públicos', display_order: 1 },
    { code: '10', name: '10 anos', minimum_age: 10, description: 'Não recomendado para menores de 10 anos', display_order: 2 },
    { code: '12', name: '12 anos', minimum_age: 12, description: 'Não recomendado para menores de 12 anos', display_order: 3 },
    { code: '14', name: '14 anos', minimum_age: 14, description: 'Não recomendado para menores de 14 anos', display_order: 4 },
    { code: '16', name: '16 anos', minimum_age: 16, description: 'Não recomendado para menores de 16 anos', display_order: 5 },
    { code: '18', name: '18 anos', minimum_age: 18, description: 'Não recomendado para menores de 18 anos', display_order: 6 },
];

export const projectionTypeData = [
    { name: '2D', description: 'Projeção 2D padrão', additional_value: 0, display_order: 1 },
    { name: '3D', description: 'Projeção 3D', additional_value: 8, display_order: 2 },
    { name: 'IMAX', description: 'Projeção IMAX', additional_value: 15, display_order: 3 },
    { name: '4DX', description: 'Experiência 4DX', additional_value: 20, display_order: 4 },
];

export const audioTypeData = [
    { name: 'Estéreo', description: 'Som estéreo padrão', additional_value: 0, display_order: 1 },
    { name: 'Dolby Digital', description: 'Som Dolby Digital', additional_value: 3, display_order: 2 },
    { name: 'Dolby Atmos', description: 'Som Dolby Atmos', additional_value: 5, display_order: 3 },
];

export const sessionLanguageData = [
    { name: 'Dublado', description: 'Filme dublado em português', abbreviation: 'DUB', display_order: 1 },
    { name: 'Legendado', description: 'Filme com legendas em português', abbreviation: 'LEG', display_order: 2 },
    { name: 'Original', description: 'Idioma original sem legendas', abbreviation: 'ORIG', display_order: 3 },
];

export const sessionStatusData = [
    { name: 'Programada', description: 'Sessão programada', allows_modification: true, display_order: 1 },
    { name: 'Aberta para Vendas', description: 'Vendas abertas', allows_modification: true, display_order: 2 },
    { name: 'Em Exibição', description: 'Filme em exibição', allows_modification: false, display_order: 3 },
    { name: 'Finalizada', description: 'Sessão finalizada', allows_modification: false, display_order: 4 },
    { name: 'Cancelada', description: 'Sessão cancelada', allows_modification: false, display_order: 5 },
];

export const seatStatusData = [
    { name: 'Disponível', description: 'Assento disponível', allows_modification: true, display_order: 1 },
    { name: 'Reservado', description: 'Assento reservado temporariamente', allows_modification: true, display_order: 2 },
    { name: 'Vendido', description: 'Assento vendido', allows_modification: false, display_order: 3 },
    { name: 'Bloqueado', description: 'Assento bloqueado', allows_modification: false, display_order: 4 },
];

export const seatTypeData = [
    { name: 'Standard', description: 'Assento padrão', additional_value: 0, display_order: 1 },
    { name: 'VIP', description: 'Assento VIP', additional_value: 10, display_order: 2 },
    { name: 'Sofá', description: 'Sofá para casal', additional_value: 15, display_order: 3 },
];

export const movieCategoryData = [
    { name: 'Ação', description: 'Filmes de ação', slug: 'acao', display_order: 1 },
    { name: 'Comédia', description: 'Filmes de comédia', slug: 'comedia', display_order: 2 },
    { name: 'Drama', description: 'Filmes dramáticos', slug: 'drama', display_order: 3 },
    { name: 'Terror', description: 'Filmes de terror', slug: 'terror', display_order: 4 },
    { name: 'Ficção Científica', description: 'Filmes de ficção científica', slug: 'ficcao-cientifica', display_order: 5 },
    { name: 'Animação', description: 'Filmes de animação', slug: 'animacao', display_order: 6 },
];

export const castTypeData = [
    { name: 'Ator/Atriz', description: 'Elenco principal', display_order: 1 },
    { name: 'Diretor', description: 'Direção do filme', display_order: 2 },
    { name: 'Roteirista', description: 'Roteiro do filme', display_order: 3 },
    { name: 'Produtor', description: 'Produção do filme', display_order: 4 },
];

export const mediaTypeData = [
    { name: 'Poster', description: 'Cartaz do filme', display_order: 1 },
    { name: 'Banner', description: 'Banner promocional', display_order: 2 },
    { name: 'Trailer', description: 'Trailer do filme', display_order: 3 },
    { name: 'Foto de Cena', description: 'Fotos de cenas do filme', display_order: 4 },
];

export const accountTypeData = [
    { name: 'Ativo', description: 'Contas de ativo', display_order: 1 },
    { name: 'Passivo', description: 'Contas de passivo', display_order: 2 },
    { name: 'Receita', description: 'Contas de receita', display_order: 3 },
    { name: 'Despesa', description: 'Contas de despesa', display_order: 4 },
    { name: 'Patrimônio Líquido', description: 'Contas de patrimônio', display_order: 5 },
];

export const accountNatureData = [
    { name: 'Devedora', description: 'Natureza devedora', display_order: 1 },
    { name: 'Credora', description: 'Natureza credora', display_order: 2 },
];

export const taxRegimeData = [
    { name: 'Simples Nacional', description: 'Regime tributário simplificado' },
    { name: 'Lucro Presumido', description: 'Regime de apuração simplificada do IR e CSLL' },
    { name: 'Lucro Real', description: 'Regime de apuração com base no lucro líquido' },
];

export const pisCofinsRegimeData = [
    { name: 'Cumulativo', description: 'Regime cumulativo (alíquotas 0,65% e 3%)', allows_credit: false },
    { name: 'Não-Cumulativo', description: 'Regime não-cumulativo (alíquotas 1,65% e 7,6%)', allows_credit: true },
];