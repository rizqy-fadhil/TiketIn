import { PrismaClient, SeatStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Clear existing data (optional, but good for idempotency)
  await prisma.passenger.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Airlines...');
  const garuda = await prisma.airline.create({
    data: {
      name: 'Garuda Indonesia',
      code: 'GA',
      logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/1/1e/Garuda_Indonesia_logo.svg/1200px-Garuda_Indonesia_logo.svg.png',
    },
  });

  const citilink = await prisma.airline.create({
    data: {
      name: 'Citilink',
      code: 'QG',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Citilink_logo.svg/1200px-Citilink_logo.svg.png',
    },
  });

  const batik = await prisma.airline.create({
    data: {
      name: 'Batik Air',
      code: 'ID',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Batik_Air_logo.svg/1200px-Batik_Air_logo.svg.png',
    },
  });

  const airlines = [garuda, citilink, batik];
  const origins = ['CGK', 'SUB', 'DPS', 'KNO', 'YIA'];
  const destinations = ['DPS', 'CGK', 'SUB', 'BPN', 'UPG'];

  console.log('Seeding Flights and Seats...');
  for (let i = 1; i <= 10; i++) {
    const airline = airlines[i % 3];
    const origin = origins[i % origins.length];
    const destination = destinations[(i + 1) % destinations.length];
    
    // Future dates
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + (i % 5) + 1);
    departureDate.setHours(8 + (i % 10), 0, 0, 0);

    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + 2); // 2 hours flight time

    const flight = await prisma.flight.create({
      data: {
        airlineId: airline.id,
        flightNumber: `${airline.code}-${100 + i}`,
        origin: origin,
        destination: destination,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
        basePrice: 500000 + (i * 100000), // Random base price 500k - 1.5M
      },
    });

    // Seed 30 seats for each flight
    const seatRows = 5;
    const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatData = [];

    for (let row = 1; row <= seatRows; row++) {
      for (const col of seatCols) {
        const statuses = [SeatStatus.AVAILABLE, SeatStatus.LOCKED, SeatStatus.BOOKED];
        // 70% chance of available, 10% locked, 20% booked
        const randomVal = Math.random();
        let status: SeatStatus = SeatStatus.AVAILABLE;
        if (randomVal > 0.9) status = SeatStatus.LOCKED;
        else if (randomVal > 0.7) status = SeatStatus.BOOKED;

        seatData.push({
          flightId: flight.id,
          seatNumber: `${row}${col}`,
          status: status,
        });
      }
    }

    await prisma.seat.createMany({
      data: seatData,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
