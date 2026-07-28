-- Migration: add_google_oauth_fields
-- Tujuan: Mendukung Google OAuth di samping login manual
--   1. Membuat kolom `password` optional (NULL diperbolehkan)
--   2. Menambahkan `googleId` (unique, nullable) untuk menyimpan Google sub claim
--   3. Menambahkan `authProvider` (default 'local') untuk membedakan jenis autentikasi

-- Buat password nullable (user Google tidak punya password)
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Tambah kolom googleId (nullable karena user lokal tidak punya)
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

-- Tambah unique constraint pada googleId
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- Tambah kolom authProvider dengan default 'local'
ALTER TABLE "User" ADD COLUMN "authProvider" TEXT NOT NULL DEFAULT 'local';
