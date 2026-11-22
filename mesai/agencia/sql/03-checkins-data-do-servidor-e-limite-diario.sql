-- Mesaí · Supabase (projeto qheadmopevmckkmugugy) · 22/11/2026 · APLICADO
-- Brecha: o app podia enviar a coluna "day" no check-in, então dava para inserir check-ins com datas antigas e inflar os pontos.
-- Correção: a data é sempre a de hoje em Maceió (definida no servidor) e há um teto de 5 check-ins por dia.
-- A regra "1 check-in por lugar por dia" já existia (UNIQUE user_id, place_id, day).
-- Testado em transação desfeita: dia enviado 2020-01-01 gravado como hoje; 5 passam (50 pontos), o 6º e o 7º são bloqueados.
-- Para mudar o teto, troque o 5 abaixo e rode de novo (create or replace).
create or replace function public.checkins_guard()
returns trigger language plpgsql set search_path = '' as $$
declare n int;
begin
  new.day := (now() at time zone 'America/Maceio')::date;
  new.created_at := now();
  select count(*) into n from public.checkins where user_id = new.user_id and day = new.day;
  if n >= 5 then
    raise exception 'Limite de 5 check-ins por dia atingido.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists checkins_guard_trg on public.checkins;
create trigger checkins_guard_trg before insert on public.checkins
for each row execute function public.checkins_guard();
-- Para desfazer: drop trigger checkins_guard_trg on public.checkins; drop function public.checkins_guard();
