-- Mesaí · Supabase (projeto qheadmopevmckkmugugy) · 22/11/2026
-- 1) Usuário comum não pode alterar os próprios pontos (hoje a política profiles_update_own deixa).
--    O ganho de pontos por check-in continua: add_checkin_points atualiza o perfil em trigger aninhado (pg_trigger_depth() >= 2).
-- 2) Fixa o search_path de comments_moderate (alerta de segurança). O corpo usa nomes qualificados.
-- Nota: o trigger de moderação JÁ impede usuário comum de mudar status/reviewed_at/flags do próprio comentário (conferido).
create or replace function public.profiles_protect()
returns trigger language plpgsql set search_path = '' as $$
begin
  if pg_trigger_depth() < 2 and not (select private.is_admin()) then
    new.points := old.points;
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end;
$$;
drop trigger if exists profiles_protect_trg on public.profiles;
create trigger profiles_protect_trg before update on public.profiles
for each row execute function public.profiles_protect();
alter function public.comments_moderate() set search_path = '';
-- Para desfazer: drop trigger profiles_protect_trg on public.profiles; drop function public.profiles_protect(); alter function public.comments_moderate() reset search_path;
