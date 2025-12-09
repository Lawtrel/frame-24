import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`🚀 Iniciando Setup Completo do Ambiente...`);

  // --- 1. LIMPEZA (Opcional, mas recomendada se não rodar o db:reset) ---
  // console.log('🧹 Limpando dados antigos...');
  // await prisma.company_users.deleteMany({});
  // await prisma.companies.deleteMany({});
  // ... (melhor usar pnpm db:reset antes)

  // --- 2. CRIAR EMPRESA E ADMIN ---
  console.log(`🏢 Criando Empresa e Admin...`);
  
  const companyId = randomUUID();
  const company = await prisma.companies.create({
    data: {
      id: companyId,
      corporate_name: 'Lawtrel Administração',
      trade_name: 'Lawtrel Admin',
      tenant_slug: 'lawtrel-admin',
      cnpj: '00000000000100',
      email: 'contato@lawtrel.com',
      tax_regime: 'SIMPLES_NACIONAL',
      active: true,
    }
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('lawtrel', salt);

  const person = await prisma.persons.create({
    data: {
      id: randomUUID(),
      full_name: 'Super Admin',
      email: 'admin@lawtrel.com',
      cpf: '00000000000',
    }
  });

  const identity = await prisma.identities.create({
    data: {
      id: randomUUID(),
      person_id: person.id,
      email: 'admin@lawtrel.com',
      password_hash: hashedPassword,
      identity_type: 'EMPLOYEE',
      active: true,
      email_verified: true,
    }
  });

  const role = await prisma.custom_roles.create({
    data: {
      id: randomUUID(),
      company_id: companyId,
      name: 'Super Admin',
      description: 'Acesso total ao sistema',
      is_system_role: true,
      hierarchy_level: 1
    }
  });

  await prisma.company_users.create({
    data: {
      id: randomUUID(),
      company_id: companyId,
      identity_id: identity.id,
      role_id: role.id,
      employee_id: 'ADM-001',
      active: true,
    }
  });

  // --- 3. CRIAR PERMISSÕES ---
  console.log(`🔐 Configurando Permissões...`);
  const permissionsList = [
    { r: 'movies', a: 'read', n: 'Ver Filmes' }, { r: 'movies', a: 'create', n: 'Criar Filmes' },
    { r: 'movies', a: 'update', n: 'Editar Filmes' }, { r: 'movies', a: 'delete', n: 'Excluir Filmes' },
    { r: 'movie_categories', a: 'read', n: 'Ver Categorias' },
    { r: 'suppliers', a: 'read', n: 'Ver Fornecedores' },
    { r: 'users', a: 'read', n: 'Ver Usuários' },
  ];

  for (const p of permissionsList) {
    const code = `${p.r}:${p.a}`;
    const perm = await prisma.permissions.create({
      data: {
        id: randomUUID(),
        company_id: companyId,
        resource: p.r,
        action: p.a,
        code: code,
        name: p.n,
      }
    });
    
    await prisma.role_permissions.create({
      data: { id: randomUUID(), role_id: role.id, permission_id: perm.id }
    });
  }

  // --- 4. POPULAR CATÁLOGO (Classificações, Categorias, Tipos) ---
  console.log(`📚 Populando Catálogo...`);
  
  // Classificações
  const ratings = [
    { c: 'L', n: 'Livre', age: 0 }, { c: '10', n: '10 Anos', age: 10 },
    { c: '12', n: '12 Anos', age: 12 }, { c: '14', n: '14 Anos', age: 14 },
    { c: '16', n: '16 Anos', age: 16 }, { c: '18', n: '18 Anos', age: 18 }
  ];
  for (const r of ratings) {
    await prisma.age_ratings.create({
      data: { id: randomUUID(), company_id: companyId, code: r.c, name: r.n, minimum_age: r.age }
    });
  }

  // Categorias
  const categories = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Terror', 'Ficção Científica', 'Romance', 'Animação', 'Fantasia'];
  for (const cat of categories) {
    const slug = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    await prisma.movie_categories.create({
      data: { id: randomUUID(), company_id: companyId, name: cat, slug, active: true }
    });
  }

  // Tipos de Elenco e Mídia
  const castTypes = ['Diretor', 'Ator', 'Roteirista'];
  for (const ct of castTypes) await prisma.cast_types.create({ data: { id: randomUUID(), company_id: companyId, name: ct } });
  
  const mediaTypes = ['Poster', 'Backdrop', 'Trailer'];
  for (const mt of mediaTypes) await prisma.media_types.create({ data: { id: randomUUID(), company_id: companyId, name: mt } });

  // Fornecedores
  const supplierType = await prisma.supplier_types.create({
    data: { id: randomUUID(), company_id: companyId, name: 'Distribuidora' }
  });

  const distributors = [
    { n: 'Warner Bros.', c: '00000000000200' }, { n: 'Disney', c: '00000000000300' },
    { n: 'Sony Pictures', c: '00000000000400' }, { n: 'Universal', c: '00000000000500' },
    { n: 'Imagem Filmes', c: '00000000000600' }, { n: 'Globo Filmes', c: '00000000000700' }
  ];

  for (const d of distributors) {
    await prisma.suppliers.create({
      data: {
        id: randomUUID(), company_id: companyId, corporate_name: d.n, trade_name: d.n,
        cnpj: d.c, email: 'dist@test.com', active: true, is_film_distributor: true, supplier_type_id: supplierType.id
      }
    });
  }

  // --- 5. CRIAR FILMES ---
  console.log(`🎬 Criando Filmes...`);
  
  // Helpers
  const getDist = async (name: string) => prisma.suppliers.findFirst({ where: { company_id: companyId, trade_name: { contains: name } } });
  const getRating = async (code: string) => prisma.age_ratings.findFirst({ where: { company_id: companyId, code } });
  const getCat = async (name: string) => prisma.movie_categories.findFirst({ where: { company_id: companyId, name: { contains: name } } });

  const movies = [
    { title: 'Vingadores: Ultimato', orig: 'Avengers: Endgame', dist: 'Disney', dur: 181, age: '12', cat: 'Ação', year: 2019 },
    { title: 'O Auto da Compadecida', orig: 'O Auto da Compadecida', dist: 'Sony', dur: 104, age: '12', cat: 'Comédia', year: 2000, nat: true },
    { title: 'Duna: Parte Dois', orig: 'Dune: Part Two', dist: 'Warner', dur: 166, age: '14', cat: 'Ficção', year: 2024 },
    { title: 'Cidade de Deus', orig: 'Cidade de Deus', dist: 'Imagem', dur: 130, age: '18', cat: 'Drama', year: 2002, nat: true },
  ];

  for (const m of movies) {
    const dist = await getDist(m.dist);
    const rating = await getRating(m.age);
    const cat = await getCat(m.cat);

    if (dist && rating) {
      const slug = m.orig.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const movie = await prisma.movies.create({
        data: {
          id: randomUUID(),
          company_id: companyId,
          distributor_id: dist.id,
          original_title: m.orig,
          brazil_title: m.title,
          duration_minutes: m.dur,
          production_year: m.year,
          national: m.nat || false,
          age_rating_id: rating.id,
          active: true,
          slug: slug
        }
      });

      if (cat) {
        await prisma.movies_on_categories.create({
          data: { movie_id: movie.id, category_id: cat.id }
        });
      }
    }
  }

  console.log(`\n✅ SETUP COMPLETO FINALIZADO!`);
  console.log(`\n👉 Agora faça LOGOUT e LOGIN novamente no painel.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });