-- Mesaí · SQL 03b: só o que FALTA aplicar (check-in e pontos já estão no banco). Cole inteiro no SQL Editor do Supabase e clique Run.
-- Idempotente. Para desfazer, veja o fim do arquivo 03-…sql.
begin;

-- 0) Helper: limite de frequência por usuário e tabela (janela em minutos).
create or replace function private.rate_limit(_table regclass, _user uuid, _minutes int, _max int)
returns boolean language plpgsql stable security definer set search_path = '' as $$
declare n int;
begin
  execute format('select count(*) from %s where user_id = $1 and created_at > now() - make_interval(mins => $2)', _table)
    into n using _user, _minutes;
  return n < _max;
end;
$$;
revoke all on function private.rate_limit(regclass, uuid, int, int) from public, anon, authenticated;

-- 2) COMENTÁRIOS: no máximo 5 a cada 10 min e 30 por dia; sem repetir o mesmo texto na última hora; força created_at do servidor.
create or replace function public.comments_antispam()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.created_at := now();
  if not private.rate_limit('public.comments'::regclass, new.user_id, 10, 5)
     or not private.rate_limit('public.comments'::regclass, new.user_id, 1440, 30) then
    raise exception 'Você está comentando rápido demais. Tente de novo em alguns minutos.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.comments where user_id = new.user_id and lower(btrim(body)) = lower(btrim(new.body)) and created_at > now() - interval '1 hour') then
    raise exception 'Você já enviou esse comentário.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists comments_antispam_trg on public.comments;
create trigger comments_antispam_trg before insert on public.comments for each row execute function public.comments_antispam();

-- 3) SUGESTÕES DE LUGAR: no máximo 5 por dia.
create or replace function public.suggestions_antispam()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.created_at := now();
  if not private.rate_limit('public.suggestions'::regclass, new.user_id, 1440, 5) then
    raise exception 'Limite diário de sugestões atingido.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists suggestions_antispam_trg on public.suggestions;
create trigger suggestions_antispam_trg before insert on public.suggestions for each row execute function public.suggestions_antispam();

-- 4) MARCAÇÕES DE AMBIENTE: no máximo 40 por dia.
create or replace function public.ambience_antispam()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.created_at := now();
  if not private.rate_limit('public.ambience_marks'::regclass, new.user_id, 1440, 40) then
    raise exception 'Limite diário de marcações atingido.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists ambience_antispam_trg on public.ambience_marks;
create trigger ambience_antispam_trg before insert on public.ambience_marks for each row execute function public.ambience_antispam();

-- 5) PERFIL: avatar só pode apontar para o bucket do próprio projeto (evita imagem de rastreio ou conteúdo externo); nome com limite.
--    "not valid" não reprova linhas antigas; valide depois com: alter table public.profiles validate constraint ...;
alter table public.profiles drop constraint if exists profiles_avatar_url_check;
alter table public.profiles add constraint profiles_avatar_url_check
  check (avatar_url is null or avatar_url like 'https://qheadmopevmckkmugugy.supabase.co/storage/v1/object/public/avatars/%') not valid;
alter table public.profiles drop constraint if exists profiles_display_name_check;
alter table public.profiles add constraint profiles_display_name_check
  check (display_name is null or char_length(display_name) <= 40) not valid;

-- 6) UPLOAD DE AVATAR: máx. 2 MB e só imagem (o bucket hoje aceita qualquer arquivo e qualquer tamanho).
update storage.buckets set file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/png','image/webp'] where id = 'avatars';

commit;
