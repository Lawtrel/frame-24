interface TagGroup {
  name: string;
  description: string;
  tags: string[];
}

export const TAG_GROUPS: TagGroup[] = [
  {
    name: 'Audit',
    description:
      'Módulo responsável pelo registro e consulta de logs de auditoria do sistema. Permite rastrear ações executadas por usuários e serviços, garantindo transparência, conformidade e segurança operacional. Essencial para monitoramento de eventos críticos, investigações internas e compliance corporativo.',
    tags: ['Audit Logs'],
  },
  {
    name: 'Identity',
    description:
      'Conjunto de endpoints responsáveis pela autenticação, autorização e gestão de identidade organizacional. Abrange login, controle de acesso baseado em papéis e cadastro de usuários e empresas. Essencial para o fluxo de segurança e controle de permissões do sistema.',
    tags: ['Auth', 'Companies', 'Roles', 'Users'],
  },
  {
    name: 'Operations',
    description:
      'Domínio operacional que centraliza toda a estrutura física e técnica dos cinemas. Inclui o gerenciamento de complexos, salas de exibição, tipos de áudio, projeção e assentos. Este grupo garante a padronização e rastreabilidade das operações de exibição.',
    tags: [
      'Cinema Complexes',
      'Rooms',
      'Seats',
      'Seat Status',
      'Audio Types',
      'Projection Types',
      'Seat Types',
      'Showtimes',
      'Session Status',
      'Session Languages',
    ],
  },
  {
    name: 'Catalog',
    description:
      'Módulo de curadoria e gestão de conteúdo audiovisual e produtos relacionados. Contém endpoints para categorias de filmes, cadastro de obras (Movies) e produtos de venda (Products). Atua como fonte principal de dados para exibição, venda e integração com parceiros de conteúdo.',
    tags: ['Movie Categories', 'Movies', 'Product Categories', 'Products'],
  },
  {
    name: 'Inventory',
    description:
      'Camada de controle logístico e de suprimentos. Reúne endpoints voltados ao cadastro e gestão de fornecedores e insumos utilizados nas operações do cinema. Permite rastrear origem, disponibilidade e relacionamento com parceiros comerciais.',
    tags: ['Suppliers'],
  },
];

export function getAllTags(): string[] {
  return TAG_GROUPS.flatMap((group) => group.tags);
}
