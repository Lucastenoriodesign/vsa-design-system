// Configuração pública do Supabase. A chave "publishable" foi feita para ficar no navegador;
// quem protege os dados são as regras de acesso (RLS) no banco. Nunca coloque aqui a chave "service_role".
var MESAI_CONFIG = {
  supabaseUrl: 'https://qheadmopevmckkmugugy.supabase.co',
  supabaseKey: 'sb_publishable_3dxPT5hvfLnuijNpglaQKg_jTzMJIL8',
  // Ligue (true) só depois de ativar o provedor Google no Supabase (Authentication > Providers) e cadastrar o redirect do site.
  googleLogin: false,
  // Planos e Mesaí+: ficam escondidos (banner, perfil, tela de oferta) até existir cobrança de verdade.
  // Para religar, troque para true.
  planos: true
};
