-- AlterTable
ALTER TABLE "briefings" ADD COLUMN     "arquivado_em" TIMESTAMP(3),
ADD COLUMN     "em_producao_em" TIMESTAMP(3),
ADD COLUMN     "publicado_em" TIMESTAMP(3),
ADD COLUMN     "submetido_em" TIMESTAMP(3);

-- Backfill: briefings já existentes com status submetido recebem submetidoEm = criado_em
UPDATE "briefings" SET "submetido_em" = "criado_em" WHERE "status" = 'submetido' AND "submetido_em" IS NULL;
