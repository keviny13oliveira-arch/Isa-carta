# Isa — Carta

Projeto da carta digital interativa.

## Arquitetura
- `index.html`: interface da carta, hospedada pelo GitHub Pages.
- `supabase-config.js`: configuração pública do Supabase (chave publishable/anon; nunca colocar chaves secret/service_role no frontend).
- Supabase Storage: fotos e vídeos.
- Supabase Database: metadados das memórias.
- Spotify: playlist incorporada nas páginas.

## Próximos passos
1. Publicar a versão atual da carta no `index.html`.
2. Integrar autenticação e upload persistente de fotos/vídeos.
3. Ativar GitHub Pages.
