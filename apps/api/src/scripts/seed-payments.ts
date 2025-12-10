import { PrismaClient } from '@repo/db';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('💳 Criando Métodos de Pagamento...');

  const company = await prisma.companies.findFirst({ where: { active: true } });
  if (!company) return console.error('❌ Nenhuma empresa ativa encontrada.');

  const methods = [
    { name: 'Cartão de Crédito', fee: 3.5, days: 30 },
    { name: 'Cartão de Débito', fee: 1.5, days: 1 },
    { name: 'Pix', fee: 0.9, days: 0 },
    { name: 'Dinheiro', fee: 0, days: 0 }
  ];

  for (const m of methods) {
    await prisma.payment_methods.upsert({
      where: { company_id_name: { company_id: company.id, name: m.name } },
      update: {},
      create: {
        id: randomUUID(),
        company_id: company.id,
        name: m.name,
        description: `Pagamento via ${m.name}`,
        operator_fee: m.fee,
        settlement_days: m.days
      }
    });
    console.log(`✅ Método criado: ${m.name}`);
  }
  console.log('🚀 Script finalizado!');
}

main().finally(() => prisma.$disconnect());