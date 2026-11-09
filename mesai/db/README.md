# Mesaí · banco de dados (Supabase)

Projeto Supabase: organização "mesai" (região West US / Oregon). As migrações aplicadas são:
`mesai_schema_inicial`, `mesai_seed_estabelecimentos`, `mesai_endurece_seguranca`.

## Tabelas (todas com RLS ligado)
| Tabela | Para quê | Quem lê | Quem escreve |
|---|---|---|---|
| `places` | os 23 estabelecimentos | qualquer pessoa vê os `published = true` | só admin |
| `profiles` | nome e pontos | o próprio usuário (e admin) | o usuário muda só `display_name`; pontos só por gatilho |
| `admins` | quem modera | ninguém pela API | só pelo painel do Supabase |
| `comments` | comentários da comunidade | todos veem os `aprovado`; autor vê os seus; admin vê todos | autor cria (sempre entra `pendente`); só admin muda o status |
| `checkins` | "Estive aqui" (1 por lugar por dia, +10 pontos) | só o dono | só o dono |
| `ambience_marks` | marcações de ambiente | todos | cada um gerencia as suas |
| `saved_places` | favoritos | só o dono | só o dono |
| `suggestions` | sugestões de lugares | dono e admin | dono cria; admin decide |

## Segurança
- `private.is_admin()` fica num esquema não exposto pela API.
- Os gatilhos (`handle_new_user`, `add_checkin_points`, `comments_guard`) não podem ser chamados pela API.
- Verificação de segurança do Supabase (advisors): sem alertas.

## Para virar admin (moderador)
Depois de criar a sua conta no app, rode no SQL Editor do Supabase:
`insert into public.admins (user_id) select id from auth.users where email = 'SEU_EMAIL';`

## Falta
- Ligar o app (`mesai/v2`) ao Supabase: login por e-mail, ler lugares, publicar comentários, check-in e favoritos.
- Configurar o login (e-mail) em Authentication > Providers.
- Triagem de comentários por IA (função no servidor, com a chave guardada no servidor).
