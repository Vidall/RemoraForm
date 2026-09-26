-- CreateTable
CREATE TABLE "briefings" (
    "id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "negocio_nome" TEXT NOT NULL,
    "negocio_segmento" TEXT NOT NULL,
    "negocio_descricao" TEXT NOT NULL,
    "negocio_slogan" TEXT NOT NULL,
    "contato_whatsapp" TEXT NOT NULL,
    "contato_instagram" TEXT NOT NULL,
    "contato_email" TEXT,
    "contato_endereco" TEXT,
    "cor_primaria" TEXT NOT NULL,
    "cor_secundaria" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "estilo_fonte" TEXT NOT NULL,
    "hero_titulo" TEXT NOT NULL,
    "hero_subtitulo" TEXT NOT NULL,
    "hero_texto_cta" TEXT NOT NULL,
    "hero_imagem" TEXT NOT NULL,
    "produtos" JSONB NOT NULL,
    "provas_sociais" JSONB,
    "nome_cliente_interno" TEXT NOT NULL,
    "slug_subdominio" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "briefings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "briefings_slug_subdominio_key" ON "briefings"("slug_subdominio");

-- CreateIndex
CREATE INDEX "briefings_status_idx" ON "briefings"("status");

-- CreateIndex
CREATE INDEX "briefings_slug_subdominio_idx" ON "briefings"("slug_subdominio");
