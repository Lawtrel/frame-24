import { PrismaClient } from '@repo/db';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🗣️ Iniciando criação de Idiomas de Sessão...');

  // 1. Buscar a empresa
  const company = await prisma.companies.findFirst({
    where: { active: true }
  });

  if (!company) {
    console.error('❌ Nenhuma empresa encontrada.');
    return;
  }

  console.log(`🏢 Empresa: ${company.corporate_name}`);

  const languages = [
    { name: 'Dublado', abbreviation: 'DUB' },
    { name: 'Legendado', abbreviation: 'LEG' },
    { name: 'Nacional', abbreviation: 'NAC' },
    { name: 'Original', abbreviation: 'ORIG' },
  ];

  for (const lang of languages) {
    // Upsert para não duplicar se rodar de novo
    const record = await prisma.session_languages.upsert({
      where: {
        company_id_name: {
          company_id: company.id,
          name: lang.name
        }
      },
      update: {},
      create: {
        id: randomUUID(),
        company_id: company.id,
        name: lang.name,
        abbreviation: lang.abbreviation,
        description: `Áudio ${lang.name}`
      }
    });
    console.log(`✅ Idioma criado/verificado: ${record.name}`);
  }

  console.log('🚀 Script finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });