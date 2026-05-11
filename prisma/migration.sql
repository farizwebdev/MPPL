-- CreateEnum (quoted untuk match dengan Prisma)
CREATE TYPE "PaymentStatus" AS ENUM ('LUNAS', 'BELUM_LUNAS');
CREATE TYPE "LaundryStatus" AS ENUM ('ANTREAN', 'DICUCI', 'DISETRIKA', 'SIAP_DIAMBIL', 'SELESAI', 'DISUMBANGKAN');

-- CreateTable customers
CREATE TABLE IF NOT EXISTS "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "no_wa" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex customers
CREATE INDEX "customers_no_wa_idx" ON "customers"("no_wa");

-- CreateTable services
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_per_kg" INTEGER NOT NULL,
    "estimated_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable transactions
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" TEXT NOT NULL,
    "receipt_code" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "total_berat" DOUBLE PRECISION NOT NULL,
    "total_biaya" INTEGER NOT NULL,
    "status_pembayaran" "PaymentStatus" NOT NULL DEFAULT 'BELUM_LUNAS',
    "status_cucian" "LaundryStatus" NOT NULL DEFAULT 'ANTREAN',
    "catatan_khusus" TEXT,
    "tanggal_pengambilan" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex transactions
CREATE UNIQUE INDEX "transactions_receipt_code_key" ON "transactions"("receipt_code");
CREATE INDEX "transactions_customer_id_idx" ON "transactions"("customer_id");
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");
CREATE INDEX "transactions_status_cucian_idx" ON "transactions"("status_cucian");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
