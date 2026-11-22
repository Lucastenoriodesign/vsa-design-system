# Backend Supabase (qheadmopevmckkmugugy) - auditoria somente leitura, 22/11/2026

Nada foi alterado. So SELECT, listagens e advisors.

## Resumo
- 8 tabelas em public, todas com RLS ligado. Bucket avatars com 4 politicas. 7 migracoes aplicadas (09/11 a 16/11).
- places: 39 linhas, 38 publicadas (mcz-cu-001..040, sem 034; mcz-cu-002 Kidelicia fica oculta). Local: 40 itens, 38 publicados.
- Os IDs publicados sao os mesmos dos dois lados (nenhum lugar falta em um lado). So existe no local, nao publicado: mcz-far-001 (nao esta no servidor; esta oculto, sem impacto).
- Dados dos lugares estao DEFASADOS no servidor em relacao ao data.js (ver P1).

## Achados priorizados

### P1 - Servidor atrasado em relacao a data.js (coerencia)
Publicados com dado: coordenadas servidor 14 x local 26; horario servidor 0 x local 17; foto de capa servidor 13 x local 19.
O app usa o servidor e cai no local; se o servidor responder, pode mostrar menos dado que o local. Conferir se app.js mescla os campos (local prevalece quando servidor e nulo) ou so usa o servidor.
Acao: atualizar `places` (lat, lng, hours, photo_url, photo_source) a partir de data.js, com fonte verificavel. Precisa confirmacao do Lucas (escrita em dados). Gerar o UPDATE por script a partir de data.js, nao a mao. Nao inventar: onde data.js esta null, manter null ("Nao informado").
Obs: JK Delicias (001) tem nota de conflito de endereco (iFood) pendente; nao sincronizar coordenada ate conferir.

### P2 - Seguranca (advisors)
1. `public.comments_moderate` com search_path mutavel (WARN). Correcao proposta (nao executada):
```sql
alter function public.comments_moderate() set search_path = public, private, pg_temp;
```
(Conferir antes se a funcao le `private.banned_terms` com nome qualificado.)
2. `public.delete_my_account()` SECURITY DEFINER executavel por authenticated via RPC (WARN). E intencional (e o proposito da funcao); confirmar que ela usa auth.uid() e bloqueia a conta dona. Revogar de anon, se ainda tiver:
```sql
revoke execute on function public.delete_my_account() from anon, public;
```
3. Protecao contra senha vazada desligada (Auth). Ligar no painel: Authentication > Passwords. Mexe em autenticacao: pedir confirmacao.

### P3 - Performance (advisors)
1. Politicas permissivas multiplas em SELECT: `comments` (read_approved + read_own_or_admin) e `places` (admin_all + read_published) para authenticated. Impacto minimo com 39 lugares. Proposta para places: trocar `places_admin_all` (ALL) por INSERT/UPDATE/DELETE separadas, deixando o SELECT so em read_published mais uma policy de admin ver nao publicados:
```sql
drop policy places_admin_all on public.places;
create policy places_admin_write on public.places for insert to authenticated with check ((select private.is_admin()));
create policy places_admin_update on public.places for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy places_admin_delete on public.places for delete to authenticated using ((select private.is_admin()));
-- SELECT: unificar
drop policy places_read_published on public.places;
create policy places_read on public.places for select to anon, authenticated using (published = true or (select private.is_admin()));
```
Mexe em RLS: so aplicar com confirmacao.
2. 4 indices sem uso (comments_place_idx, checkins_place_idx, ambience_place_idx, saved_place_idx). Tabelas quase vazias; manter, pois sao indices de FK e passarao a ser usados com volume.

### P4 - Observacoes de RLS (sem problema critico)
- checkins: so INSERT e SELECT proprio; sem UPDATE/DELETE (ok). Conferir se o limite de 1 check-in por lugar/dia e imposto no banco (unique) e nao so no app.
- profiles: sem INSERT/DELETE por policy (criado por trigger e apagado por delete_my_account), ok. `points` e atualizavel pelo proprio usuario via profiles_update_own (with_check so confere id): usuario pode se dar pontos via REST. Proposta: trigger que bloqueia mudanca de `points` por nao admin, ou restringir colunas:
```sql
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
```
Verificar antes se o app atualiza `points` direto; se sim, mover para funcao/trigger. Prioridade media: afeta a futura troca de pontos por vantagens.
- comments_update permite ao dono editar a propria linha inteira, inclusive `status` (pendente para aprovado), o que contorna a moderacao automatica, salvo se o trigger comments_moderate_trg roda tambem em UPDATE. Verificar a definicao do trigger (nao inspecionei o corpo da funcao). Proposta: restringir colunas ou garantir trigger BEFORE INSERT OR UPDATE.
- suggestions: sem policy de UPDATE para o dono, ok. places sem foto/horario publico: tudo certo com "Nao informado".
- avatars: leitura publica do bucket (esperado), escrita restrita a pasta do uid.

## Nao verificado
Corpo das funcoes/triggers, grants de tabela, configuracao de e-mail/Auth (confirmacao, Resend), conteudo de private.banned_terms, e se app.js mescla servidor com local.
