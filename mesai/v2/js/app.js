var CATS=[['Tudo','Todos',null],['Restaurantes','Restaurante','assets/cat-regional.jpg'],['Hamburguerias','Hamburgueria','assets/cat-hamburguer.jpg'],['Pizzarias','Pizzaria','assets/cat-pizza.jpg'],['Lanchonetes','Lanchonete','assets/cat-lanches.jpg'],['Pastelarias','Pastelaria','assets/cat-lanches.jpg'],['Cafeterias e padarias','Cafeteria e padaria','assets/cat-cafe.jpg'],['Açaíterias','Açaíteria','assets/cat-acai.jpg']];
var REGIONS=['Tudo','Graciliano Ramos','Cidade Universitária','Eustáquio Gomes','Shopping Pátio'];
var EVID={indicado_em_listagens_e_avaliacoes:'Indicado em listagens e avaliações online',informado_no_site_oficial:'Informado no site oficial do estabelecimento',a_confirmar:'Ainda não confirmado'};
function load(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function $(id){return document.getElementById(id)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function catImg(g){var c=CATS.find(function(x){return x[0]===g});return c&&c[2]||'assets/cat-regional.jpg'}
function region(p){var r=p.r;return r.indexOf('Shopping')>-1?'Shopping Pátio':r.indexOf('Graciliano')>-1?'Graciliano Ramos':r.indexOf('Eust')>-1?'Eustáquio Gomes':'Cidade Universitária'}
function shortAddr(p){return p.e.replace(/, Cidade Universitária, Maceió - AL$/,'').replace(/, Maceió - AL$/,'')}
var photosOk=load('mesai-photos',{});
var amb=load('mesai-amb',{});var checkins=load('mesai-checkins',[]);
var AMB=['Ar-condicionado','Mesas ao ar livre','Bom para estudar','Aceita pets','Estacionamento','Bom para grupos'];
function today(){return new Date().toISOString().slice(0,10)}
function points(){return (S2.on&&API.user())?S2.points:checkins.length*10}
function doCheckin(id){if(S2.on&&API.user()){API.checkin(id).then(function(){S2.points+=10;toast('+10 pontos');renderAll();openDetail(id)}).catch(function(e){toast(e.status===409?'Você já marcou este lugar hoje':'Não foi possível marcar agora')});return}
 if(S2.on&&!API.user()){toast('Entre na sua conta para ganhar pontos');openSheet('security');return}
 var t=today();if(checkins.some(function(c){return c.id===id&&c.d===t})){toast('Você já marcou este lugar hoje');return}checkins.push({id:id,d:t});store('mesai-checkins',checkins);toast('+10 pontos · neste aparelho');renderAll();openDetail(id)}
var published=new Set(load('mesai-published',[]));
var sugg=load('mesai-suggestions',[]).filter(function(s){return s&&typeof s.id==='string'&&s.n});
var BASE=DATA;
var places=BASE.concat(sugg);
function visible(p){return p.pub||published.has(p.id)}
var saved=new Set(load('mesai-saved',[]).filter(function(id){return places.some(function(p){return p.id===id})}));
var posts=load('mesai-posts',[]).filter(function(x){return x&&x.id&&x.text});
var S={cat:'Tudo',region:'Tudo',q:'',mode:'list',flags:[],sort:'az'};
function byId(id){return places.find(function(p){return p.id===id})}
var BAIRROS_ATIVOS=['Cidade Universitária'];
var BAIRROS_MCZ=['Ponta Verde','Jatiúca','Pajuçara','Jacintinho','Tabuleiro do Martins','Serraria','Centro','Farol','Santo Amaro','Mangabeiras','Antares','Barro Duro','Bebedouro','Benedito Bentes','Bom Parto','Canaã','Chã da Jaqueira','Chã de Bebedouro','Clima Bom','Cruz das Almas','Feitosa','Fernão Velho','Garça Torta','Gruta de Lourdes','Guaxuma','Ipioca','Jacarecica','Jaraguá','Jardim Petrópolis','Levada','Mutange','Ouro Preto','Pescaria','Petrópolis','Pinheiro','Pitanguinha','Ponta Grossa','Ponta da Terra','Pontal da Barra','Poço','Prado','Riacho Doce','Rio Novo','Santa Amélia','Santa Lúcia','Santos Dumont','São Jorge','Trapiche da Barra','Vergel do Lago'];
var bairro=load('mesai-bairro','Cidade Universitária');if(BAIRROS_ATIVOS.indexOf(bairro)<0)bairro='Cidade Universitária';
function inBairro(p){return bairro==='Graciliano Ramos'?region(p)==='Graciliano Ramos':true}
function pubPlaces(){return places.filter(visible).filter(inBairro)}
function renderBairro(){var b=$('locationButton');if(b)b.textContent=bairro+', Maceió'}
function match(p){var t=(p.n+' '+p.g+' '+p.c+' '+p.d+' '+p.e+' '+p.r).toLowerCase();
 if(S.q&&t.indexOf(S.q.toLowerCase())<0)return false;
 if(S.cat!=='Tudo'&&p.g!==S.cat)return false;
 if(S.region!=='Tudo'&&region(p)!==S.region)return false;
 if(S.flags.indexOf('tel')>-1&&!p.t)return false;
 if(S.flags.indexOf('shop')>-1&&region(p)!=='Shopping Pátio')return false;
 if(S.flags.indexOf('amb')>-1&&!(amb[p.id]&&amb[p.id].length))return false;
 if(S.flags.indexOf('kid')>-1&&p.kid!==true)return false;
 if(S.flags.indexOf('pet')>-1&&p.pet!==true)return false;
 return true}
function yn(v){return v===true?'Aceita':v===false?'Não aceita':'Não informado'}
function sorted(a){return a.slice().sort(function(x,y){return S.sort==='reg'?(region(x).localeCompare(region(y))||x.n.localeCompare(y.n)):x.n.localeCompare(y.n)})}
function pic(p){var a=photosOk[p.id];return a?a.u:p.foto}
var COV={'Restaurantes':['#e4efe3','#2f6a4f'],'Hamburguerias':['#fde1d3','#b4472a'],'Pizzarias':['#fff0c9','#8a5d00'],'Lanchonetes':['#fbe4e0','#a3412c'],'Pastelarias':['#ffe9d0','#8d4f10'],'Cafeterias e padarias':['#efe3d6','#6b4a33'],'Açaíterias':['#f1e4f3','#6d2f7a']};
function photo(p,cls){var u=pic(p),c=COV[p.g]||['#efe9df','#5c564e'],ini=(p.n.replace(/[^A-Za-zÀ-ÿ0-9]/g,' ').trim()[0]||'M').toUpperCase();
 return '<span class="'+cls+' cov" style="--c1:'+c[0]+';--c2:'+c[1]+'" aria-hidden="true"><b>'+esc(ini)+'</b><small>'+esc(p.g)+'</small>'+(u?'<img src="'+esc(u)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</span>'}
function heartBtn(p){var on=saved.has(p.id);return '<button class="heart'+(on?' on':'')+'" data-heart="'+esc(p.id)+'" aria-pressed="'+on+'" aria-label="'+(on?'Remover ':'Salvar ')+esc(p.n)+(on?' dos salvos':'')+'">salvar</button>'}
function placeCard(p){return '<div class="cw p">'+heartBtn(p)+'<button class="place" data-open="'+esc(p.id)+'">'+photo(p,'pimg')+'<span class="pinfo"><div class="ptitle">'+esc(p.n)+'</div><div class="pcat">'+esc(p.g)+'</div><div class="ptags">'+esc(shortAddr(p))+'</div>'+(p.suggested?'<span class="presencial">Aguardando revisão</span>':'')+'</span></button></div>'}
function emptyBox(msg){return '<div class="empty">'+msg+'<br><button class="btn ghost" data-reset>Limpar filtros</button></div>'}
function renderHome(){
 $('categories').innerHTML=CATS.map(function(c){return '<button class="cat" data-homecat="'+esc(c[0])+'">'+(c[2]?'<img src="'+c[2]+'" alt="">':'<span class="cat-all-icon"><i></i></span>')+c[1]+'</button>'}).join('');
 var pp=pubPlaces();var d=new Date(),k=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%Math.max(pp.length,1),h=pp[k];
 $('hero').innerHTML=h?'<div class="hero"><button class="hero-main" data-open="'+esc(h.id)+'">'+photo(h,'hphoto')+'<span class="hbody"><b>'+esc(h.n)+'</b><small>'+esc(h.g)+' · '+esc(region(h))+'</small><i>'+esc(h.d)+'</i></span></button><div class="hero-act"><button class="btn" data-open="'+esc(h.id)+'">Ver detalhes</button><button class="btn ghost" data-surprise>Surpreenda-me</button></div></div>':'';
 $('homeList').innerHTML=pp.slice(0,6).map(placeCard).join('');
 $('homeCount').textContent='Ver todos os '+pp.length;
}
function renderSearch(){
 $('catChips').innerHTML=CATS.map(function(c){return '<button class="chip'+(S.cat===c[0]?' active':'')+'" data-cat="'+esc(c[0])+'" aria-pressed="'+(S.cat===c[0])+'">'+(c[2]?'<img src="'+c[2]+'" alt="">':'')+c[1]+'</button>'}).join('');
 $('filters').innerHTML=REGIONS.map(function(f){var on=S.region===f;return '<button class="filter'+(on?' active':'')+'" data-region="'+esc(f)+'" aria-pressed="'+on+'">'+(f==='Tudo'?'Toda a região':f)+'</button>'}).join('')+[['tel','Tem telefone'],['shop','No shopping'],['amb','Ambiente que marquei'],['kid','Aceita criança'],['pet','Aceita pet']].map(function(f){var on=S.flags.indexOf(f[0])>-1;return '<button class="filter'+(on?' active':'')+'" data-flag="'+f[0]+'" aria-pressed="'+on+'">'+f[1]+'</button>'}).join('');
 var rows=sorted(pubPlaces().filter(match));
 $('sortBtn').textContent='Ordenar: '+(S.sort==='reg'?'por região':'A–Z');
 $('filtBtn').textContent='Filtros'+((S.region!=='Tudo'?1:0)+S.flags.length?' ('+((S.region!=='Tudo'?1:0)+S.flags.length)+')':'');
 $('count').textContent=rows.length+(rows.length===1?' lugar encontrado':' lugares encontrados');
 var map=S.mode==='map';$('list').hidden=map;$('map').hidden=!map;
 $('modeList').classList.toggle('on',!map);$('modeMap').classList.toggle('on',map);$('modeList').setAttribute('aria-pressed',!map);$('modeMap').setAttribute('aria-pressed',map);
 $('list').innerHTML=rows.length?rows.map(placeCard).join(''):emptyBox((S.flags.indexOf('kid')>-1||S.flags.indexOf('pet')>-1)?'Ainda estamos confirmando, lugar por lugar, quem aceita crianças e pets. Volte em breve.':'Não encontrei um lugar com esses filtros.');
 if(map)renderMap(rows);
}
function valid(p){return typeof p.lat==='number'&&typeof p.lng==='number'&&p.lat<-9.3&&p.lat>-9.9&&p.lng<-35.5&&p.lng>-36.0}
var MAP_QUERY='57073-490, Maceió, AL, Brasil';
function renderMap(rows){
 var ok=rows.filter(valid);
 var src='https://www.google.com/maps?q='+encodeURIComponent(MAP_QUERY)+'&output=embed';
 $('map').innerHTML='<iframe class="map-frame" title="Mapa da região" src="'+src+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><div class="map-note"><b>Mapa da região (CEP 57073-490)</b><br>Pins dos lugares só aparecem quando o endereço tiver coordenada confirmada ('+ok.length+' de '+rows.length+' agora). Se o mapa não carregar, <a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(MAP_QUERY)+'" target="_blank" rel="noopener noreferrer">abra no Google Maps</a>.</div>';
}
function renderEmAlta(){}
var prof=load('mesai-profile',{name:'Lucas Tenório'});var notif=load('mesai-notif',{novos:true,comunidade:true});
function renderProfile(){var nm=(S2.on&&API.user()&&S2.name)||prof.name||'Lucas Tenório';$('pName').textContent=nm;$('rvName').textContent=nm;
 var n=places.filter(function(p){return saved.has(p.id)}).length;$('rvSaved').textContent=n;$('rvPts').textContent=points();$('rvSugg').textContent=sugg.length}
function listRows(arr,act,lbl){return arr.length?arr.map(function(p){return '<div class="mini"><button class="o" data-open="'+esc(p.id)+'">'+esc(p.n)+'<small>'+esc(p.g)+'</small></button><button class="x" data-'+act+'="'+esc(p.id)+'">'+lbl+'</button></div>'}).join(''):''}
function bairroRow(n,on){return '<button class="opt brr'+(n===bairro?' sel':'')+'" data-bairro="'+esc(n)+'" aria-pressed="'+(n===bairro)+'"><span>'+esc(n)+'</span><i>'+(n===bairro?'✓':'')+'</i></button>'}
function accountHtml(){
 if(!S2.on)return '<p class="sheet-copy">A conta ainda não está disponível: não consegui falar com o servidor do Mesaí. Seus dados ficam só neste aparelho.</p><button class="btn ghost block" data-cleardata>Apagar dados deste aparelho</button>';
 var u=API.user();
 if(u)return '<p class="sheet-copy">Você está conectado como <b>'+esc(u.email)+'</b>.'+(S2.admin?' Você é <b>moderadora</b>.':'')+'</p><div class="pts"><b>'+S2.points+'</b><span>pontos na sua conta</span></div><button class="btn block" data-auth="out">Sair da conta</button><div class="note">Seus favoritos, check-ins e comentários ficam guardados na sua conta.</div><button class="btn ghost block" data-cleardata>Apagar dados deste aparelho</button>';
 return '<p class="sheet-copy">Entre para comentar, ganhar pontos e guardar seus favoritos na nuvem.</p><form class="form" id="authForm"><label>E-mail<input name="email" type="email" required autocomplete="email"></label><label>Senha<input name="password" type="password" minlength="6" required autocomplete="current-password" placeholder="mínimo 6 caracteres"></label><label id="nameRow" hidden>Como quer ser chamada(o)?<input name="name" maxlength="40"></label><button class="btn block" type="submit" data-auth="in" id="authGo">Entrar</button><button class="btn ghost block" type="button" id="authSwitch">Criar conta</button><p class="fine" id="authMsg" role="status"></p></form>'}
function openSheet(k){lastFocus=document.activeElement;var T='',B='';
 if(k==='bairro'){T='Escolher bairro';B='<p class="sheet-copy">Por enquanto o Mesaí cobre só este bairro. Os outros chegam aos poucos.</p>'+BAIRROS_ATIVOS.map(function(n){return bairroRow(n)}).join('')+'<h3 class="sec-t">Em breve</h3>'+BAIRROS_MCZ.filter(function(n){return BAIRROS_ATIVOS.indexOf(n)<0}).map(function(n){return '<div class="opt brr off"><span>'+esc(n)+'</span><em>em breve</em></div>'}).join('')}
 else if(k==='edit'){T='Gerenciar perfil';B='<form class="form" id="profForm"><label>Seu nome<input name="name" maxlength="40" value="'+esc(prof.name||'')+'" required></label><button class="btn block" type="submit">Salvar</button></form><div class="note">O nome fica salvo só neste aparelho. Ainda não há conta nem e-mail.</div>'}
 else if(k==='security'){T='Conta e segurança';B=accountHtml()}
 else if(k==='notif'){T='Notificações';B=NOTIFS_HTML+'<label class="opt">Novos lugares na região<input type="checkbox" data-notif="novos"'+(notif.novos?' checked':'')+'></label><label class="opt">Respostas e aprovação dos meus comentários<input type="checkbox" data-notif="comunidade"'+(notif.comunidade?' checked':'')+'></label><div class="note">Por enquanto só guardamos a sua preferência. O app ainda não envia avisos.</div>'}
 else if(k==='lang'){T='Idioma';B='<label class="opt">Português (Brasil)<input type="radio" name="lg" checked></label><label class="opt"><span>English <small>em breve</small></span><input type="radio" name="lg" disabled></label><label class="opt"><span>Español <small>em breve</small></span><input type="radio" name="lg" disabled></label>'}
 else if(k==='theme'){T='Tema';B='<label class="opt">Claro<input type="radio" name="th" checked></label><label class="opt"><span>Escuro <small>em breve</small></span><input type="radio" name="th" disabled></label><label class="opt"><span>Automático <small>em breve</small></span><input type="radio" name="th" disabled></label>'}
 else if(k==='points'){T='Meus pontos';var hist=checkins.slice().reverse().map(function(c){var p=byId(c.id);return '<div class="mini"><span>'+esc(p?p.n:'Lugar')+'<small>'+esc(c.d)+'</small></span><b>+10</b></div>'}).join('');B='<div class="pts"><b>'+points()+'</b><span>pontos neste aparelho</span></div><p class="sheet-copy">Ganhe 10 pontos por marcar “Estive aqui” em um lugar (1 vez por lugar por dia). Em breve: pontos por avaliações aprovadas e fotos.</p><div class="note">Os pontos ainda são locais. Viram pontos de verdade, com níveis e recompensas, quando existir conta e servidor.</div>'+(hist||'<div class="empty">Sem check-ins ainda.</div>')}
 else if(k==='saved'){T='Lugares salvos';var sv=places.filter(function(p){return saved.has(p.id)});B=sv.length?listRows(sv,'unsave','Remover'):'<div class="empty">Você ainda não salvou nenhum lugar. Abra um lugar e toque em “Salvar lugar”.</div>'}
 else if(k==='sugg'){T='Minhas sugestões';B=(sugg.length?listRows(sugg,'delsug','Excluir'):'<div class="empty">Nenhuma sugestão ainda.</div>')+'<button class="btn block" data-open-suggest>Sugerir um lugar</button>'}
 else if(k==='help'){T='Central de ajuda';B='<div class="faq"><b>De onde vêm os lugares?</b><p>De listagens públicas pesquisadas em 09/11/2026. Ainda não visitamos cada local.</p><b>Como sei se tem mesas?</b><p>O detalhe mostra a evidência encontrada. Ligue antes de ir para confirmar.</p><b>Por que alguns lugares estão sem foto?</b><p>Só usamos fotos com autorização. Sem ela, mostramos o desenho do tipo de comida.</p><b>Por que meu comentário não aparece?</b><p>Todo comentário passa por aprovação antes de ficar visível.</p><b>Por que não há mapa?</b><p>Ainda não validamos coordenadas dos endereços. Use “Traçar rota” em cada lugar.</p></div>'}
 else if(k==='about'){T='Sobre o Mesaí';B='<p class="sheet-copy">O Mesaí ajuda a descobrir restaurantes e lanchonetes onde dá para comer no local, começando pela parte alta de Maceió. Não é um app de entrega: não há pedido, pagamento nem reserva.</p><div class="note">Versão de demonstração. Sem conta, sem servidor, sem avaliações, preços ou horários. Dados de listagens públicas, sem visita física.</div><button class="btn ghost block" data-onboard>Rever a introdução</button>'}
 else if(k==='pend'){closeOverlays();go('admin');return}
 $('infoHead').textContent=T;$('infoBody').innerHTML=B;$('infoOverlay').classList.add('open');var c=$('infoOverlay').querySelector('.close');c.focus();
 var f=$('profForm');if(f)f.onsubmit=function(e){e.preventDefault();prof.name=String(new FormData(f).get('name')||'').trim()||'Lucas Tenório';store('mesai-profile',prof);renderProfile();closeOverlays();toast('Perfil atualizado')}}
function refreshSheet(){var o=$('infoOverlay');if(!o.classList.contains('open'))return;var h=$('infoHead').textContent;var K={'Lugares salvos':'saved','Minhas sugestões':'sugg'}[h];if(K)openSheet(K)}
function renderPhotos(){var h='';BASE.forEach(function(p){if(!p.fc||!p.fc.length)return;var a=photosOk[p.id];
 h+='<div class="card photo-q"><h3>'+esc(p.n)+'</h3><p>'+esc(p.obs||'')+'</p>'+p.fc.map(function(f,i){var cur=a&&a.u===f.u;return '<div class="cand"><img src="'+esc(f.u)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.opacity=.25"><div><b>'+esc(f.t)+'</b><br>'+esc(f.n)+'<br><a href="'+esc(f.s)+'" target="_blank" rel="noopener noreferrer">Ver fonte</a>'+(f.t==='logo'?'<br>Logo: não usar como foto.':'<br><button class="btn'+(cur?' ghost':'')+'" data-usephoto="'+esc(p.id)+'|'+i+'">'+(cur?'Em uso · remover':'Usar como capa')+'</button>')+'</div></div>'}).join('')+'<label class="rights"><input type="checkbox" id="ok-'+esc(p.id)+'"'+(a?' checked':'')+'> Tenho autorização do titular para usar estas fotos no Mesaí.</label></div>'});
 $('photoQueue').innerHTML=h||'<div class="empty">Sem fotos candidatas.</div>'}
function renderAdmin(){renderPhotos();
 var pend=BASE.filter(function(p){return !p.pub});
 $('adminList').innerHTML=pend.map(function(p){var on=published.has(p.id);return '<div class="card"><h3>'+esc(p.n)+'</h3><p>'+esc(p.g)+' · '+esc(p.e)+'</p><p>Tel.: '+esc(p.t||'não informado')+' · Atendimento no local: <b>'+(on?'confirmado por você':'a confirmar')+'</b></p>'+(p.f?'<p><a href="'+esc(p.f)+'" target="_blank" rel="noopener noreferrer">Fonte</a> · ':'<p>')+'<a href="'+esc(p.m)+'" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a></p><button class="btn block'+(on?' ghost':'')+'" data-pub="'+esc(p.id)+'">'+(on?'Despublicar':'Confirmei atendimento presencial · publicar')+'</button></div>'}).join('');
 $('adminSum').textContent=pend.length+' cadastros pendentes · '+pend.filter(function(p){return published.has(p.id)}).length+' publicados por você neste navegador.';
}
var SEED=[];
function ago(t){var m=Math.floor((Date.now()-t)/60000);return m<1?'agora':m<60?'há '+m+' min':m<1440?'há '+Math.floor(m/60)+' h':'há '+Math.floor(m/1440)+' d'}
function feedItems(){return S2.on?S2.feed:posts.filter(function(x){return x.status==='aprovado'||x.status==='pendente'||x.status==='rejeitado'}).concat(SEED)}
function renderFeed(){var sel=$('postPlace');sel.innerHTML='<option value="">Sem lugar específico</option>'+pubPlaces().map(function(p){return '<option value="'+esc(p.id)+'">'+esc(p.n)+'</option>'}).join('');
 $('feed').innerHTML=feedItems().map(function(x){var sv=!!x.sv,mine=sv?x.mine:x.id>0,p=x.place&&byId(x.place);return '<article class="post"><div class="post-h">'+(mine?'<img class="myav" src="" alt="">':'<span class="ini" aria-hidden="true">'+esc((x.who||'M')[0])+'</span>')+'<div><b>'+(mine?'Você':esc(x.who||'Membro')+(sv?'':' <em class="tst">teste</em>'))+'</b><small>'+ago(sv?x.t:(mine?x.id:x.t))+(p?' · '+esc(p.n):'')+'</small></div><span class="kind k-'+esc(x.kind)+'">'+esc(x.kind)+'</span></div><p>'+esc(x.text)+'</p>'+(mine&&x.status==='pendente'?'<span class="badge">Aguardando aprovação · só você vê</span>':mine&&x.status==='rejeitado'?'<span class="badge no">Não aprovado</span>':'')+'<div class="post-f">'+(sv?'':'<button data-like="'+x.id+'" class="'+(x.liked?'on':'')+'" aria-pressed="'+!!x.liked+'">'+(x.liked?'♥':'♡')+' Curtir</button>')+(mine?'<button data-delpost="'+x.id+'">Excluir</button>':'')+'</div></article>'}).join('')||'<div class="empty" style="margin-top:12px">Ninguém comentou ainda. Seja o primeiro: conte como foi, deixe uma dica ou um elogio.</div>'}
function screen(t){var m=[],x=t.toLowerCase();
 if(/(\bidiota\b|\bburro\b|\blixo\b|\bvagabund|\bfilho da p|\bputa\b|\bmerda\b|\bporra\b|\bcaralho\b|\bcorno\b|\bnojento\b|\bdesgraça)/.test(x))m.push('possível xingamento');
 if(/(vou (te |lhe )?(matar|bater|pegar)|vamos (pegar|bater)|ameaç|mato (ele|ela|vocês))/.test(x))m.push('possível ameaça');
 if(/(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4})/.test(x))m.push('contém CPF ou telefone');
 if(/(https?:\/\/|www\.)/.test(x))m.push('contém link');
 if(/(intoxica|vencid|barata|rato)/.test(x))m.push('acusação grave: exigir prova');
 if(t.replace(/[^A-ZÁÉÍÓÚÃÕÂÊÔÇ]/g,'').length>t.length*0.6&&t.length>20)m.push('texto em maiúsculas');
 return m}
function renderMod(){var pend=S2.on?S2.pend:posts.filter(function(x){return x.status==='pendente'});
 if(S2.on&&!S2.admin){$('modSum').textContent=API.user()?'Só moderadores veem os comentários pendentes de todos.':'Entre na sua conta para moderar.';$('modList').innerHTML='';return}
 $('modSum').textContent=pend.length+(pend.length===1?' comentário aguardando':' comentários aguardando')+'. Os comentários são publicados na hora, com filtro automático de palavras proibidas. Você pode remover qualquer um.';
 $('modList').innerHTML=pend.map(function(x){var m=x.flags||[];return '<div class="card"><h3>'+esc(x.kind)+(x.place&&byId(x.place)?' · '+esc(byId(x.place).n):'')+'</h3><p style="color:var(--ink);font-size:14px">'+esc(x.text)+'</p><span class="badge '+(m.length?'no':'ok')+'">'+(m.length?'Atenção: '+esc(m.join(', ')):'Triagem: nada suspeito')+'</span><div class="mod-row"><button class="btn ghost" data-reject="'+x.id+'">Remover</button></div></div>'}).join('')||'<div class="empty">Nenhum comentário para revisar.</div>'}
function initialAvatar(name){var l=(name||'?').trim().charAt(0).toUpperCase()||'?';var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e8e2d6"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="46" fill="#5c564e">'+l+'</text></svg>';return 'data:image/svg+xml,'+encodeURIComponent(svg)}
function setMyAvatar(){var nm=(S2.on&&API.user()&&(S2.name||''))||'';var src=(S2.on&&API.user()&&S2.avatar)||initialAvatar(nm);document.querySelectorAll('.myav').forEach(function(i){i.src=src})}
var avFile=$('avFile');if(avFile)avFile.onchange=function(){var f=avFile.files&&avFile.files[0];if(!f)return;if(!(S2.on&&API.user())){toast('Entre na conta para trocar a foto');avFile.value='';return}API.uploadAvatar(f).then(function(url){S2.avatar=url;setMyAvatar();toast('Foto atualizada')}).catch(function(){toast('Não foi possível trocar a foto')}).then(function(){avFile.value=''})};
function renderAll(){renderBairro();renderPlan();renderMod();renderFeed();renderHome();renderSearch();renderProfile();renderAdmin();setMyAvatar();updateGreet()}
var lastFocus=null;
function telHref(t){var d=String(t).replace(/\D/g,'');return d.length>=10?'+55'+d:d}
function openDetail(id){var p=byId(id);if(!p)return;lastFocus=document.activeElement;var s=saved.has(id);
 var dest=encodeURIComponent(p.n+', '+p.e);
 $('detail').innerHTML='<div class="dphoto">'+photo(p,'dph')+'</div>'+(pic(p)?'<div class="credit">Foto de terceiro, usada com autorização informada pelo responsável do app. <a href="'+esc((photosOk[p.id]||p).s||p.fs)+'" target="_blank" rel="noopener noreferrer">Fonte</a></div>':'')+'<span class="presencial" style="margin:0">'+esc(p.g)+'</span><h2 class="detail-title">'+esc(p.n)+'</h2><p class="detail-sub">'+esc(p.d)+'</p><div class="tiles"><div class="tile wide"><b>Endereço</b><span>'+esc(p.e)+'</span></div><div class="tile"><b>Telefone</b><span>'+esc(p.t||'Não informado')+'</span></div><div class="tile"><b>Horários</b><span>Não informado</span></div><div class="tile"><b>Crianças</b><span>'+yn(p.kid)+'</span></div><div class="tile"><b>Pets</b><span>'+yn(p.pet)+'</span></div><div class="tile wide"><b>Atendimento no local</b><span>'+esc(EVID[p.ev]||'Não informado')+'. Sem visita física da equipe.</span></div></div>'+
 '<a class="btn block" href="https://www.google.com/maps/dir/?api=1&destination='+dest+'" target="_blank" rel="noopener noreferrer">Traçar rota</a>'+(p.t?'<a class="btn ghost block" href="tel:'+telHref(p.t)+'">Ligar · '+esc(p.t)+'</a>':'')+(p.m?'<a class="btn ghost block" href="'+esc(p.m)+'" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>':'')+'<h3 class="sec-t">Ambiente</h3><p class="sec-s">Marque o que você viu. Com servidor, as marcações de todos aparecem aqui; por enquanto valem só no seu aparelho.</p><div class="ambs">'+AMB.map(function(a){var on=(amb[p.id]||[]).indexOf(a)>-1;var n=(S2.amb[p.id]&&S2.amb[p.id][a])||0;return '<button class="amb'+(on?' on':'')+'" data-amb="'+esc(p.id)+'|'+esc(a)+'" aria-pressed="'+on+'">'+(on?'✓ ':'')+esc(a)+(n?' · '+n:'')+'</button>'}).join('')+'</div><button class="btn ghost block" data-checkin="'+esc(p.id)+'">📍 Estive aqui · +10 pontos</button>'+
 '<button class="btn ghost block'+(s?' saved':'')+'" id="saveBtn" aria-pressed="'+s+'">'+(s?'♥ Salvo · toque para remover':'♡ Salvar lugar')+'</button>'+
 '<div class="note">Dados reunidos de listagens públicas em 09/11/2026'+(p.f?' (<a href="'+esc(p.f)+'" target="_blank" rel="noopener noreferrer">fonte</a>)':'')+'. Telefone vindo de listagem pública: confirme ao ligar. Confira horário e se há mesas antes de ir. Ainda não há fotos, preços, cardápio ou avaliações.</div>';
 $('saveBtn').onclick=function(){toggleSave(id);openDetail(id)};
 $('detailOverlay').classList.add('open');$('detailOverlay').querySelector('.close').focus()}
function toggleSave(id){setTimeout(refreshSheet,0);var was=saved.has(id);if(was){saved.delete(id);toast('Removido dos salvos')}else{saved.add(id);toast('Lugar salvo')}
 if(S2.on&&API.user()){(was?API.unsave(id):API.save(id)).catch(function(){})}store('mesai-saved',Array.from(saved));renderAll()}
function closeOverlays(){document.querySelectorAll('.overlay.open').forEach(function(o){o.classList.remove('open')});if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(function(){t.classList.remove('show')},2200)}
var VIEWS=['inicio','buscar','comunidade','em-alta','perfil','admin','planos'];
var TITLES={inicio:'Mesaí — descubra onde comer',buscar:'Buscar · Mesaí',comunidade:'Comunidade · Mesaí','em-alta':'Em alta · Mesaí',perfil:'Perfil · Mesaí',admin:'Pendentes · Mesaí',planos:'Planos · Mesaí'};
function route(){document.body.classList.toggle("is-home",(location.hash||"").replace(/^#\/?/,"")===""||(location.hash||"").indexOf("inicio")>-1);updateGreet();var v=(location.hash||'').replace(/^#\/?/,'');if(VIEWS.indexOf(v)<0)v='inicio';
 VIEWS.forEach(function(x){$('view-'+x).classList.toggle('on',x===v)});
 document.querySelectorAll('.nav').forEach(function(n){var on=n.dataset.go===v||((v==='admin'||v==='planos')&&n.dataset.go==='perfil');n.classList.toggle('active',on);if(on)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});
 closeOverlays();window.scrollTo(0,0);document.title=TITLES[v]}
function go(v){if(location.hash==='#/'+v)route();else location.hash='#/'+v}
function resetSearch(){S.cat='Tudo';S.region='Tudo';S.flags=[];S.q='';$('searchInput').value=''}
document.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;var D=t.dataset;
 if(D.go){go(D.go);return}
 if(D.onboard!==undefined){closeOverlays();onbOpen();return}
 if(D.interest){var key=D.interest;if(interest.indexOf(key)<0)interest.push(key);store('mesai-interest',interest);renderPlan();toast('Anotado neste navegador. Ainda não há cobrança.');return}
 if(D.bairro){bairro=D.bairro;store('mesai-bairro',bairro);resetSearch();renderBairro();renderAll();closeOverlays();toast('Bairro: '+bairro);return}
 if(D.notifRead!==undefined){NOTIFS.forEach(function(n){n.u=false});updateNotifBadge();openSheet('notif');toast('Notificações marcadas como lidas');return}
if(D.filtToggle!==undefined){var fr=$('filters'),o=fr.hidden;fr.hidden=!o;$('filtBtn').setAttribute('aria-expanded',String(o));return}
if(D.sheet){openSheet(D.sheet);return}
 if(D.cleardata!==undefined){clearAll();return}
 if(D.open){openDetail(D.open);return}
 if(D.homecat!==undefined){resetSearch();S.cat=D.homecat;renderSearch();go('buscar');return}
 if(D.cat!==undefined){S.cat=D.cat;renderSearch();return}
 if(D.region!==undefined){S.region=D.region;renderSearch();return}
 if(D.flag){var fi=S.flags.indexOf(D.flag);if(fi>-1)S.flags.splice(fi,1);else S.flags.push(D.flag);renderSearch();return}
 if(D.surprise!==undefined){var pool=pubPlaces().filter(match);if(!pool.length)pool=pubPlaces();openDetail(pool[Math.floor(Math.random()*pool.length)].id);return}
 if(D.amb){var q=D.amb.split('|');var cur=amb[q[0]]||[];var ix=cur.indexOf(q[1]);if(S2.on&&API.user()){(ix>-1?API.unmark(q[0],q[1]):API.mark(q[0],q[1])).catch(function(){})}if(ix>-1)cur.splice(ix,1);else cur.push(q[1]);amb[q[0]]=cur;store('mesai-amb',amb);openDetail(q[0]);return}
 if(D.checkin){doCheckin(D.checkin);return}
 if(D.heart){toggleSave(D.heart);return}
 if(D.unsave){toggleSave(D.unsave);return}
 if(D.usephoto){var a=D.usephoto.split('|'),pl=byId(a[0]),f=pl.fc[Number(a[1])];if(photosOk[pl.id]&&photosOk[pl.id].u===f.u){delete photosOk[pl.id];store('mesai-photos',photosOk);renderAll();toast('Foto removida');return}if(!$('ok-'+pl.id).checked){toast('Marque a autorização antes de usar a foto');return}photosOk[pl.id]={u:f.u,s:f.s};store('mesai-photos',photosOk);renderAll();toast('Foto aplicada neste navegador');return}
 if(D.pub){if(published.has(D.pub))published.delete(D.pub);else published.add(D.pub);store('mesai-published',Array.from(published));renderAll();toast(published.has(D.pub)?'Publicado neste navegador':'Despublicado');return}
 if((D.approve||D.reject)&&S2.on){API.setStatus(D.approve||D.reject,D.approve?'aprovado':'rejeitado').then(function(){toast(D.approve?'Aprovado':'Rejeitado');return syncComments()}).catch(function(){toast('Não conseguimos conectar. Tente de novo em instantes.')});return}
 if(D.approve||D.reject){var pp=posts.find(function(x){return x.id===Number(D.approve||D.reject)});pp.status=D.approve?'aprovado':'rejeitado';store('mesai-posts',posts);renderAll();toast(D.approve?'Aprovado':'Rejeitado');return}
 if(D.like){var q=posts.concat(SEED).find(function(x){return x.id===Number(D.like)});q.liked=!q.liked;store('mesai-posts',posts);renderFeed();return}
 if(D.delpost&&S2.on){API.delComment(D.delpost).then(function(){toast('Mensagem excluída');return syncComments()}).catch(function(){toast('Não conseguimos conectar. Tente de novo em instantes.')});return}
 if(D.delpost){posts=posts.filter(function(x){return x.id!==Number(D.delpost)});store('mesai-posts',posts);renderFeed();toast('Mensagem excluída');return}
 if(D.delsug){sugg=sugg.filter(function(s){return s.id!==D.delsug});saved.delete(D.delsug);store('mesai-suggestions',sugg);store('mesai-saved',Array.from(saved));places=BASE.concat(sugg);renderAll();toast('Sugestão excluída');refreshSheet();return}
 if(D.reset!==undefined){resetSearch();renderSearch();return}
 if(D.openSuggest!==undefined){lastFocus=t;$('suggestOverlay').classList.add('open');$('suggestForm').name.focus();return}
 if(t.hasAttribute('data-close')){closeOverlays();return}
});
document.querySelectorAll('.overlay').forEach(function(o){o.addEventListener('click',function(e){if(e.target===o)closeOverlays()})});
document.addEventListener('change',function(e){var t=e.target;if(t.dataset&&t.dataset.notif){notif[t.dataset.notif]=t.checked;store('mesai-notif',notif);toast('Preferência salva')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeOverlays();if(e.key==='Tab'){var o=document.querySelector('.overlay.open')||(!$('onb').hidden&&$('onb'));if(!o)return;var f=o.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea');if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
$('sortBtn').onclick=function(){S.sort=S.sort==='az'?'reg':'az';renderSearch()};
$('modeList').onclick=function(){S.mode='list';renderSearch()};
$('modeMap').onclick=function(){S.mode='map';renderSearch()};
$('searchInput').oninput=function(e){S.q=e.target.value.trim();renderSearch()};
$('homeSearch').onsubmit=function(e){e.preventDefault();var q=$('homeInput').value.trim();resetSearch();S.q=q;$('searchInput').value=q;$('homeInput').value='';renderSearch();go('buscar')};
$('locationButton').onclick=function(){openSheet('bairro')};
function clearAll(){if(!confirm('Apagar favoritos, sugestões, mensagens, fotos aplicadas e perfil deste navegador?'))return;['mesai-saved','mesai-suggestions','mesai-published','mesai-posts','mesai-photos','mesai-profile','mesai-notif','mesai-onboarded','mesai-interest','mesai-amb','mesai-checkins','mesai-trial','mesai-bairro'].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});saved=new Set();sugg=[];interest=[];amb={};checkins=[];bairro='Cidade Universitária';posts=[];published=new Set();photosOk={};prof={name:'Lucas Tenório'};notif={novos:true,comunidade:true};closeOverlays();places=BASE.slice();resetSearch();renderAll();toast('Dados apagados')}
CATS.slice(1).forEach(function(c){var o=document.createElement('option');o.value=c[0];o.textContent=c[1];$('sugCat').appendChild(o)});
$('suggestForm').onsubmit=function(e){e.preventDefault();var f=new FormData(e.target),name=String(f.get('name')||'').trim();if(!name)return;var cat=String(f.get('category')||'Restaurantes'),about=String(f.get('about')||'').trim();
 if(S2.on&&API.user()){API.suggest({name:name,category:cat,about:about}).catch(function(){})}
 var p={id:'sug-'+Date.now(),n:name,g:cat,c:cat,r:'Cidade Universitária',e:about||'Endereço a confirmar',d:'Sugestão da comunidade, aguardando revisão.',t:null,ev:'a_confirmar',pub:true,f:null,m:null,lat:null,lng:null,foto:null,h:null,suggested:true};
 sugg.unshift(p);store('mesai-suggestions',sugg);places=BASE.concat(sugg);e.target.reset();closeOverlays();resetSearch();renderAll();go('buscar');toast('Sugestão adicionada neste navegador')};
$('postForm').onsubmit=function(e){e.preventDefault();var tx=$('postText').value.trim();if(!tx)return;
 if(S2.on){if(!API.user()){toast('Entre na sua conta para comentar');openSheet('security');return}API.addComment({place_id:$('postPlace').value||null,kind:$('postKind').value,body:tx,flags:screen(tx)}).then(function(){$('postText').value='';toast('Comentário publicado');return syncComments()}).catch(function(){toast('Seu comentário não foi publicado. Revise as palavras e tente de novo.')});return}
posts.unshift({id:Date.now(),text:tx,kind:$('postKind').value,place:$('postPlace').value||null,status:'aprovado',flags:screen(tx)});store('mesai-posts',posts);$('postText').value='';renderAll();toast('Comentário publicado')};

var onbI=0;
function onbShow(i,dir){var ss=document.querySelectorAll('.onb-s');ss.forEach(function(x,k){x.classList.toggle('on',k===i);x.classList.toggle('out',k<i);x.setAttribute('aria-hidden',k!==i)});document.querySelectorAll('#onbDots i').forEach(function(d,k){d.classList.toggle('on',k===i)});$('onbNext').textContent=i===2?'Começar':'Continuar';$('onb').classList.toggle('offer',i===3);onbI=i}
function onbOpen(){$('onb').hidden=false;onbShow(0);$('onbNext').focus()}
function onbClose(){$('onb').hidden=true;store('mesai-onboarded',true)}
$('onbNext').onclick=function(){if(onbI>=3)onbClose();else onbShow(onbI+1)};
var opSel='anual';
document.querySelectorAll('.op').forEach(function(b){b.onclick=function(){opSel=b.dataset.op;document.querySelectorAll('.op').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});void 0}});
$('onbOffer').onclick=function(){var k='consumidor:'+opSel;if(interest.indexOf(k)<0)interest.push(k);store('mesai-interest',interest);renderPlan();onbClose();toast('Seu teste de 14 dias começou')};
$('onbFree').onclick=onbClose;$('onbX').onclick=onbClose;
$('onbSkip').onclick=onbClose;document.querySelectorAll('.o2-legal a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();onbClose()})});$('onbRestore').addEventListener('click',function(){toast('Ainda não há compras nesta versão.')});
(function(){var x0=null,t=$('onb');t.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});t.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(dx<-50&&onbI<3)onbShow(onbI+1);else if(dx>50&&onbI>0)onbShow(onbI-1)},{passive:true})})();
document.addEventListener('keydown',function(e){if($('onb').hidden)return;if(e.key==='ArrowRight'&&onbI<3)onbShow(onbI+1);if(e.key==='ArrowLeft'&&onbI>0)onbShow(onbI-1)});
if(!load('mesai-onboarded',false))onbOpen();

var interest=load('mesai-interest',[]);
var trialStart=load('mesai-trial',null);if(!trialStart){trialStart=Date.now();store('mesai-trial',trialStart)}
function trialLeft(){return Math.max(0,14-Math.floor((Date.now()-trialStart)/86400000))}
function planWho(c){$('plansC').hidden=!c;$('plansE').hidden=c;$('planC').classList.toggle('on',c);$('planE').classList.toggle('on',!c);$('planC').setAttribute('aria-pressed',c);$('planE').setAttribute('aria-pressed',!c)}
$('planC').onclick=function(){planWho(true)};$('planE').onclick=function(){planWho(false)};
function renderPlan(){var d=trialLeft();$('rvPlan').textContent=d>0?'Teste · '+d+(d===1?' dia':' dias'):'Teste encerrado';var t=$('trialStatus');if(t)t.textContent=d>0?'Restam '+d+(d===1?' dia':' dias')+' do seu teste (contado neste aparelho).':'Seu teste de 14 dias terminou. O app segue liberado nesta versão de demonstração.'}
window.addEventListener('hashchange',route);
renderAll();route();

if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',function(){try{navigator.serviceWorker.register('sw.js').catch(function(){})}catch(e){}})}

/* Banners da tela inicial: indicador acompanha o arrasto lateral */
(function(){
 var t=document.getElementById('btrack');if(!t)return;
 var dots=document.querySelectorAll('#bdots i'),ticking=false,cur=0;
 function upd(){ticking=false;var w=t.clientWidth||1,i=Math.round(t.scrollLeft/w);i=Math.min(dots.length-1,Math.max(0,i));if(i===cur)return;cur=i;for(var k=0;k<dots.length;k++)dots[k].classList.toggle('on',k===i)}
 t.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});
})();

/* Notificações de exemplo (lista local, ainda sem envio real) */
var NOTIFS=[
 {k:'lugar',i:'📍',t:'Lugar novo no seu bairro',p:'Sabor Nordestino Restaurante e Pizzaria entrou no guia de Graciliano Ramos.',h:'agora',d:'Hoje',u:true},
 {k:'pontos',i:'⭐',t:'+10 pontos no seu perfil',p:'Você marcou check-in. Continue visitando lugares para subir no ranking.',h:'há 2 h',d:'Hoje',u:true},
 {k:'comentario',i:'💬',t:'Seu comentário foi publicado',p:'Obrigado por ajudar quem vai comer no mesmo lugar.',h:'há 5 h',d:'Hoje',u:false},
 {k:'dia',i:'🍽️',t:'Lugar do dia',p:'Hoje a sugestão tem mesa, ambiente agradável e bom custo-benefício.',h:'ontem',d:'Esta semana',u:false},
 {k:'plus',i:'🎁',t:'Mesaí+ com 14 dias grátis',p:'Seu período de teste está ativo. Veja o que está incluído.',h:'há 3 dias',d:'Esta semana',u:false}
];
var NLOGO='<img class="nlogo" src="img/logo-app.png" alt="">';
function notifItems(){
 var out='',last='';
 NOTIFS.forEach(function(n){
  if(n.d!==last){out+='<h3 class="nday">'+n.d+'</h3>';last=n.d}
  out+='<div class="nitem k-'+n.k+(n.u?' unread':'')+'"><span class="nico" aria-hidden="true">'+NLOGO+'</span><div class="nbody"><b>'+n.t+'</b><p>'+n.p+'</p><small>'+n.h+'</small></div>'+(n.u?'<span class="ndot" aria-label="Não lida"></span>':'')+'</div>';
 });
 return out;
}
var NOTIFS_HTML='<div class="nhead"><span>'+NOTIFS.filter(function(n){return n.u}).length+' não lidas</span><button class="link" data-notif-read>Marcar todas como lidas</button></div><div class="nlist">'+notifItems()+'</div><h3 class="nday">Preferências</h3>';

/* Contador de notificações não lidas no sininho */
function updateNotifBadge(){var n=NOTIFS.filter(function(x){return x.u}).length,b=document.getElementById('nBadge');if(!b)return;b.textContent=n>9?'9+':String(n);b.hidden=!n;b.setAttribute('aria-label',n+' notificações não lidas')}
(function(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateNotifBadge);else updateNotifBadge()})();

/* Saudação na home: bom dia / boa tarde / boa noite + nome */
function updateGreet(){var g=document.getElementById('greet');if(!g)return;var hr=parseInt(new Intl.DateTimeFormat('pt-BR',{hour:'numeric',hour12:false,timeZone:'America/Maceio'}).format(new Date()),10)||0,p=(hr<5||hr>=18)?'Boa noite':hr<12?'Bom dia':'Boa tarde';var nm=(S2.on&&API.user()&&S2.name)||'';g.textContent=nm?p+', '+nm.split(' ')[0]+'!':p+'!';g.hidden=!document.body.classList.contains('is-home')}
