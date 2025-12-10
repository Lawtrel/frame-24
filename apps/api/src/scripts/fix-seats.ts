import { PrismaClient } from '@repo/db';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Verificando sessões sem assentos...');

  // Busca sessões futuras com 0 assentos
  const showtimes = await prisma.showtime_schedule.findMany({
    where: {
      start_time: { gt: new Date() },
      available_seats: { lte: 0 }
    },
    include: { rooms: true }
  });

  console.log(`Encontradas ${showtimes.length} sessões com 0 assentos.`);

  for (const session of showtimes) {
    console.log(`Corrigindo sessão de ${session.start_time}...`);
    
    // Atualiza os assentos disponíveis com a capacidade da sala
    await prisma.showtime_schedule.update({
      where: { id: session.id },
      data: {
        available_seats: session.rooms.capacity, // Pega da sala (ex: 50)
        blocked_seats: 0,
        sold_seats: 0
      }
    });
  }

  console.log('✅ Correção finalizada! Dê F5 no site.');
}

main().finally(() => prisma.$disconnect());