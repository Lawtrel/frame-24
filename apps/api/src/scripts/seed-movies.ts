import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log(`🎬 Iniciando seed de filmes...`);

  // 1. Recuperar a Empresa
  // Tenta buscar pelo slug. Se o ID estiver vazio (erro do seed anterior), vamos tentar corrigir ou alertar.
  let company = await prisma.companies.findUnique({
    where: { tenant_slug: 'lawtrel-admin' },
  });

  if (!company) {
    console.error('❌ Empresa "lawtrel-admin" não encontrada. Rode o create-admin.ts primeiro.');
    process.exit(1);
  }

  // Hack: Se por acaso o ID estiver vazio (devido ao default("")), vamos gerar um UUID e atualizar
  if (company.id === "") {
    console.log("⚠️ ID da empresa está vazio. Corrigindo para um UUID válido...");
    const newId = randomUUID();
    // Precisamos deletar e recriar ou atualizar via SQL bruto, pois o Prisma não deixa alterar ID facilmente se houver relações.
    // Como é ambiente de dev/seed, vamos assumir que podemos usar o ID vazio por enquanto ou que o usuário vai resetar o banco se precisar.
    // Para este script, vamos seguir com o ID que temos, mas recomendo resetar o banco (pnpm db:reset) e ajustar o create-admin se persistir.
    console.warn("⚠️ Continuando com ID vazio. Recomendado resetar o banco e usar UUIDs no create-admin.ts.");
  }

  const companyId = company.id;

  // 2. Garantir Distribuidores Extras (Para filmes BR)
  console.log('🚚 Verificando distribuidores...');
  const supplierType = await prisma.supplier_types.findUnique({
    where: { company_id_name: { company_id: companyId, name: 'Distribuidora' } }
  });

  if (!supplierType) throw new Error("Tipo de fornecedor 'Distribuidora' não encontrado. Rode o seed-catalog.ts primeiro.");

  const extraDistributors = [
    { name: 'Imagem Filmes', cnpj: '00000000000700' },
    { name: 'Globo Filmes', cnpj: '00000000000800' },
    { name: 'Vitrine Filmes', cnpj: '00000000000900' },
    { name: 'Warner', cnpj: '00000000000200' }, // Garantindo Warner se não existir pelo nome exato
    { name: 'Sony', cnpj: '00000000000500' },   // Garantindo Sony
    { name: 'Disney', cnpj: '00000000000400' }, // Garantindo Disney
    { name: 'Universal', cnpj: '00000000000300' } // Garantindo Universal
  ];

  for (const dist of extraDistributors) {
    // Busca flexível para não duplicar se já existir com nome completo (ex: Warner Bros. Pictures)
    const existing = await prisma.suppliers.findFirst({
        where: { 
            company_id: companyId, 
            OR: [
                { cnpj: dist.cnpj },
                { trade_name: { contains: dist.name, mode: 'insensitive' } }
            ]
        }
    });

    if (!existing) {
        await prisma.suppliers.create({
            data: {
                id: randomUUID(),
                company_id: companyId,
                corporate_name: dist.name,
                trade_name: dist.name,
                cnpj: dist.cnpj,
                email: `contato@${dist.name.toLowerCase().replace(/\s+/g, '')}.com.br`,
                active: true,
                is_film_distributor: true,
                supplier_type_id: supplierType.id
            }
        });
    }
  }

  // 3. Helper para buscar IDs
  const getDistributorId = async (name: string) => {
    const dist = await prisma.suppliers.findFirst({
      where: { company_id: companyId, trade_name: { contains: name, mode: 'insensitive' } }
    });
    return dist?.id;
  };

  const getAgeRatingId = async (code: string) => {
    const rating = await prisma.age_ratings.findFirst({
      where: { company_id: companyId, code: code }
    });
    return rating?.id;
  };

  const getCategoryId = async (name: string) => {
    const cat = await prisma.movie_categories.findFirst({
      where: { company_id: companyId, name: { contains: name, mode: 'insensitive' } }
    });
    return cat?.id;
  };

  const getCastTypeId = async (name: string) => {
    const type = await prisma.cast_types.findFirst({
      where: { company_id: companyId, name: { contains: name, mode: 'insensitive' } }
    });
    return type?.id;
  };

  const directorTypeId = await getCastTypeId('Diretor');
  const actorTypeId = await getCastTypeId('Ator');

  // 4. Lista de Filmes para Inserir
  const movies = [
    // --- MARVEL / DISNEY / SONY ---
    {
      original_title: 'Avengers: Endgame',
      brazil_title: 'Vingadores: Ultimato',
      distributor: 'Disney',
      year: 2019,
      duration: 181,
      rating: '12',
      categories: ['Ação', 'Ficção Científica', 'Aventura'],
      national: false,
      synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados remanescentes, os Vingadores se reúnem mais uma vez para desfazer as ações de Thanos e restaurar a ordem do universo.',
      director: 'Anthony Russo',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo']
    },
    {
      original_title: 'Spider-Man: No Way Home',
      brazil_title: 'Homem-Aranha: Sem Volta para Casa',
      distributor: 'Sony',
      year: 2021,
      duration: 148,
      rating: '12',
      categories: ['Ação', 'Aventura', 'Fantasia'],
      national: false,
      synopsis: 'Peter Parker tem a sua identidade secreta revelada e pede ajuda ao Doutor Estranho. Quando um feitiço para reverter o evento não sai como o esperado, o Homem-Aranha e seu companheiro Vingador precisam enfrentar inimigos de todo o multiverso.',
      director: 'Jon Watts',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch']
    },
    {
        original_title: 'Black Panther: Wakanda Forever',
        brazil_title: 'Pantera Negra: Wakanda Para Sempre',
        distributor: 'Disney',
        year: 2022,
        duration: 161,
        rating: '12',
        categories: ['Ação', 'Aventura', 'Drama'],
        national: false,
        synopsis: 'A rainha Ramonda, Shuri, M\'Baku, Okoye e as Dora Milaje lutam para proteger sua nação contra as potências mundiais intervenientes logo após a morte do Rei T\'Challa.',
        director: 'Ryan Coogler',
        cast: ['Letitia Wright', 'Angela Bassett', 'Tenoch Huerta']
    },

    // --- WARNER ---
    {
      original_title: 'The Batman',
      brazil_title: 'Batman',
      distributor: 'Warner',
      year: 2022,
      duration: 176,
      rating: '14',
      categories: ['Ação', 'Crime', 'Drama'],
      national: false,
      synopsis: 'Nos dois anos em que protegeu as ruas como Batman, Bruce Wayne mergulhou nas sombras de Gotham City. Agora, um assassino mira a elite de Gotham com uma série de maquinações sádicas, e Bruce, o Maior Detetive do Mundo, passa a investigar o submundo de Gotham.',
      director: 'Matt Reeves',
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Jeffrey Wright']
    },
    {
      original_title: 'Dune: Part Two',
      brazil_title: 'Duna: Parte Dois',
      distributor: 'Warner',
      year: 2024,
      duration: 166,
      rating: '14',
      categories: ['Ficção Científica', 'Aventura'],
      national: false,
      synopsis: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson']
    },

    // --- FILMES BRASILEIROS ---
    {
      original_title: 'Ó Paí, Ó',
      brazil_title: 'Ó Paí, Ó',
      distributor: 'Imagem', // Imagem Filmes
      year: 2007,
      duration: 96,
      rating: '14',
      categories: ['Comédia', 'Musical'],
      national: true,
      synopsis: 'Em um cortiço do centro histórico do Pelourinho, em Salvador, os moradores compartilham a paixão pelo Carnaval e a antipatia pela síndica do prédio, Dona Joana. Todos tentam se divertir e sobreviver em meio à folia.',
      director: 'Monique Gardenberg',
      cast: ['Lázaro Ramos', 'Wagner Moura', 'Dira Paes']
    },
    {
      original_title: 'Tropa de Elite',
      brazil_title: 'Tropa de Elite',
      distributor: 'Universal', // Universal distribuiu o 2, mas serve para o exemplo ou Zazen
      year: 2007,
      duration: 115,
      rating: '16',
      categories: ['Ação', 'Crime', 'Drama'],
      national: true,
      synopsis: 'Nascimento, capitão da Tropa de Elite do Rio de Janeiro, é designado para chefiar uma das turmas que têm como missão apaziguar o Morro do Turano. Ele precisa encontrar um substituto para seu posto enquanto tenta derrubar o tráfico de drogas e a criminalidade na cidade.',
      director: 'José Padilha',
      cast: ['Wagner Moura', 'André Ramiro', 'Caio Junqueira']
    },
    {
      original_title: 'Cidade de Deus',
      brazil_title: 'Cidade de Deus',
      distributor: 'Imagem',
      year: 2002,
      duration: 130,
      rating: '18',
      categories: ['Crime', 'Drama'],
      national: true,
      synopsis: 'Buscapé é um jovem pobre, negro e muito sensível, que cresce em um universo de muita violência. Ele vive na Cidade de Deus, favela carioca conhecida por ser um dos locais mais violentos da cidade. Amedrontado com a possibilidade de se tornar um bandido, Buscapé acaba sendo salvo de seu destino por causa de seu talento como fotógrafo.',
      director: 'Fernando Meirelles',
      cast: ['Alexandre Rodrigues', 'Leandro Firmino', 'Phellipe Haagensen']
    },
    {
      original_title: 'O Auto da Compadecida',
      brazil_title: 'O Auto da Compadecida',
      distributor: 'Sony', // Sony/Columbia
      year: 2000,
      duration: 104,
      rating: '12',
      categories: ['Comédia', 'Aventura', 'Fantasia'],
      national: true,
      synopsis: 'As aventuras de João Grilo e Chicó, dois nordestinos pobres que vivem de golpes para sobreviver. Eles estão sempre enganando o povo de um pequeno vilarejo no sertão da Paraíba, inclusive o temido cangaceiro Severino de Aracaju, que os persegue pela região.',
      director: 'Guel Arraes',
      cast: ['Matheus Nachtergaele', 'Selton Mello', 'Fernanda Montenegro']
    },
    {
        original_title: 'Deus e o Diabo na Terra do Sol',
        brazil_title: 'Deus e o Diabo na Terra do Sol',
        distributor: 'Globo', // Globo Filmes (relançamentos/restauros) ou Vitrine
        year: 1964,
        duration: 120,
        rating: '14',
        categories: ['Drama', 'Aventura'],
        national: true,
        synopsis: 'O vaqueiro Manuel e sua esposa Rosa fogem para o sertão depois que ele mata um coronel que tentou enganá-lo. No ermo brasileiro, eles encontram duas figuras icônicas: o santo Sebastião e o cangaceiro Corisco.',
        director: 'Glauber Rocha',
        cast: ['Geraldo Del Rey', 'Yoná Magalhães', 'Othon Bastos']
    }
  ];

  console.log(`🍿 Processando ${movies.length} filmes...`);

  for (const m of movies) {
    const distId = await getDistributorId(m.distributor);
    const ratingId = await getAgeRatingId(m.rating);
    
    if (!distId) {
      console.warn(`⚠️ Distribuidor não encontrado para ${m.original_title}: ${m.distributor}`);
      continue;
    }

    const slug = m.original_title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]+/g, "-") // Substitui chars especiais por hifen
        .replace(/^-+|-+$/g, ""); // Remove hifens do inicio/fim

    // Criar o filme
    const movie = await prisma.movies.upsert({
      where: { slug }, 
      update: {},
      create: {
        id: randomUUID(),
        company_id: companyId,
        distributor_id: distId,
        original_title: m.original_title,
        brazil_title: m.brazil_title,
        duration_minutes: m.duration, // <--- CORRIGIDO: Era m.duration_minutes
        production_year: m.year,
        national: m.national,
        age_rating_id: ratingId,
        synopsis: m.synopsis,
        slug: slug,
        active: true,
      }
    });

    // Vincular Categorias
    for (const catName of m.categories) {
      const catId = await getCategoryId(catName);
      if (catId) {
        const exists = await prisma.movies_on_categories.findUnique({
            where: { movie_id_category_id: { movie_id: movie.id, category_id: catId } }
        });

        if (!exists) {
            await prisma.movies_on_categories.create({
            data: {
                movie_id: movie.id,
                category_id: catId
            }
            });
        }
      }
    }

    // Adicionar Elenco
    // Limpar elenco anterior para evitar duplicatas em re-run
    await prisma.movie_cast.deleteMany({ where: { movie_id: movie.id } });

    if (directorTypeId) {
        await prisma.movie_cast.create({
            data: {
                id: randomUUID(),
                movie_id: movie.id,
                cast_type: directorTypeId,
                artist_name: m.director,
                credit_order: 0
            }
        });
    }

    if (actorTypeId) {
        let order = 1;
        for (const actor of m.cast) {
            await prisma.movie_cast.create({
                data: {
                    id: randomUUID(),
                    movie_id: movie.id,
                    cast_type: actorTypeId,
                    artist_name: actor,
                    credit_order: order++
                }
            });
        }
    }

    console.log(`✅ Filme inserido: ${m.brazil_title}`);
  }

  console.log(`\n🎉 Seed de filmes concluído!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });