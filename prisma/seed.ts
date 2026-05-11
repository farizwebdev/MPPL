import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const services = [
    { id: "REGULER", name: "Reguler (3 hari)", pricePerKg: 4000, estimatedTime: "3 hari" },
    { id: "KILAT_2", name: "Kilat (2 hari)", pricePerKg: 5000, estimatedTime: "2 hari" },
    { id: "KILAT_1", name: "Kilat (1 hari)", pricePerKg: 8000, estimatedTime: "1 hari" },
    { id: "EXPRESS", name: "Express (5 jam)", pricePerKg: 10000, estimatedTime: "5 jam" },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }

  console.log("✅ Seed data berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
