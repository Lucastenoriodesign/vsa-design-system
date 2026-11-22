try{if(/[?&]primeiro-acesso=1/.test(location.search))localStorage.removeItem("mesai-onboarded")}catch(e){}
var ICP={"download": "<path d=\"M12 3v12m0 0-4-4m4 4 4-4M5 21h14\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>", "send": "<path d=\"M21 3 10 14M21 3l-7 18-4-7-7-4z\"/>", "login": "<path d=\"M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4m0 0 4 4m-4-4h11\"/>", "logout": "<path d=\"M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M14 8l4 4m0 0-4 4m4-4H8\"/>", "trash": "<path d=\"M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3\"/>", "refresh": "<path d=\"M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/>", "image": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"1.5\"/><path d=\"m21 16-5-5-8 8\"/>", "route": "<path d=\"M3 11 21 3l-8 18-2.2-7.8z\"/>", "phone": "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z\"/>", "share": "<path d=\"M12 15V3m0 0L8 7m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7\"/>", "x": "<path d=\"M6 6l12 12M18 6 6 18\"/>", "back": "<path d=\"M19 12H5m6-6-6 6 6 6\"/>", "next": "<path d=\"M5 12h14m-6-6 6 6-6 6\"/>", "check": "<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>", "heart": "<path d=\"M12 20.5S4.5 15.9 3 11.2C2 8 4 5 7.2 5c1.8 0 3.2.9 4.8 2.7C13.6 5.9 15 5 16.8 5 20 5 22 8 21 11.2c-1.5 4.7-9 9.3-9 9.3Z\"/>", "star": "<path d=\"m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9L12 3.5Z\"/>", "spark": "<path d=\"M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.7-10 10-.7-5.3-4.7-9.3-10-10 5.3-.7 9.3-4.7 10-10Z\"/>", "pin": "<path d=\"M12 21s7-6.1 7-11.5a7 7 0 0 0-14 0C5 14.9 12 21 12 21Z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/>"};
function ico(n,fill){return '<svg class="i" viewBox="0 0 24 24" fill="'+(fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICP[n]+'</svg>'}
var CATS=[['Tudo','Todos','assets/cat-todos.jpg'],['Restaurantes','Restaurante','assets/cat-regional.jpg'],['Hamburguerias','Hamburgueria','assets/cat-hamburguer.jpg'],['Pizzarias','Pizzaria','assets/cat-pizza.jpg'],['Lanchonetes','Lanchonete','assets/cat-lanches.jpg'],['Pastelarias','Pastelaria','assets/cat-pastel.jpg'],['Cafeterias e padarias','Cafeteria e padaria','assets/cat-cafe.jpg'],['Açaíterias','Açaíteria','assets/cat-acai.jpg']];
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
function doCheckin(id){if(S2.on&&API.user()){API.checkin(id).then(function(){S2.points+=10;toast('+10 pontos');NATIVE.haptic('ok');renderAll();openDetail(id)}).catch(function(e){toast(e.status===409?'Você já marcou este lugar hoje':'Não foi possível marcar agora')});return}
 if(S2.on&&!API.user()){toast('Entre na sua conta para ganhar pontos');openSheet('security');return}
 var t=today();if(checkins.some(function(c){return c.id===id&&c.d===t})){toast('Você já marcou este lugar hoje');return}checkins.push({id:id,d:t});store('mesai-checkins',checkins);toast('+10 pontos · neste aparelho');renderAll();openDetail(id)}
var published=new Set(load('mesai-published',[]));
var sugg=load('mesai-suggestions',[]).filter(function(s){return s&&typeof s.id==='string'&&s.n});
var BASE=DATA;
var places=BASE.concat(sugg);
function visible(p){return p.pub||published.has(p.id)}
var saved=new Set(load('mesai-saved',[]).filter(function(id){return places.some(function(p){return p.id===id})}));
var posts=load('mesai-posts',[]).filter(function(x){return x&&x.id&&x.text});
var S={cat:'Tudo',region:'Tudo',q:'',mode:'list',flags:[],sort:'comp'};
function byId(id){return places.find(function(p){return p.id===id})}
var BAIRROS_ATIVOS=['Cidade Universitária'];
var BAIRROS_MCZ=['Ponta Verde','Jatiúca','Pajuçara','Jacintinho','Tabuleiro do Martins','Serraria','Centro','Farol','Santo Amaro','Mangabeiras','Antares','Barro Duro','Bebedouro','Benedito Bentes','Bom Parto','Canaã','Chã da Jaqueira','Chã de Bebedouro','Clima Bom','Cruz das Almas','Feitosa','Fernão Velho','Garça Torta','Gruta de Lourdes','Guaxuma','Ipioca','Jacarecica','Jaraguá','Jardim Petrópolis','Levada','Mutange','Ouro Preto','Pescaria','Petrópolis','Pinheiro','Pitanguinha','Ponta Grossa','Ponta da Terra','Pontal da Barra','Poço','Prado','Riacho Doce','Rio Novo','Santa Amélia','Santa Lúcia','Santos Dumont','São Jorge','Trapiche da Barra','Vergel do Lago'];
var bairro=load('mesai-bairro','Cidade Universitária');if(BAIRROS_ATIVOS.indexOf(bairro)<0)bairro='Cidade Universitária';
function inBairro(p){return bairro==='Graciliano Ramos'?region(p)==='Graciliano Ramos':true}
function pubPlaces(){return places.filter(visible).filter(inBairro)}
function renderBairro(){var b=$('locationButton');if(b)b.textContent=bairro+', Maceió'}
/* Horário: só vale se estiver confirmado, no formato [{d:[0..6],a:'HH:MM',f:'HH:MM'}] (d: 0=domingo). Sem isso, retorna null (desconhecido). */
function openNow(p){var h=p.h;if(!Array.isArray(h)||!h.length)return null;
 var f=new Intl.DateTimeFormat('en-US',{weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Maceio'}).formatToParts(new Date()),g={};f.forEach(function(x){g[x.type]=x.value});
 var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g.weekday),now=(parseInt(g.hour,10)%24)*60+parseInt(g.minute,10),ok=false;
 h.forEach(function(s){if(!s||!Array.isArray(s.d)||s.d.indexOf(day)<0)return;var a=s.a.split(':'),b=s.f.split(':'),A=a[0]*60+ +a[1],B=b[0]*60+ +b[1];if(B>A?(now>=A&&now<B):(now>=A||now<B))ok=true});return ok}
/* Momento da refeição: só vale com dado verificado (campo mo: ['cafe','almoco','janta','lanche']). Sem dado, o filtro nem aparece. */
var MOMENTS=[['cafe','Café da manhã'],['almoco','Almoço'],['janta','Janta'],['lanche','Lanche']];
var FLAGS=[['open','Aberto agora'],['tel','Tem telefone'],['shop','No shopping'],['amb','Ambiente que marquei'],['kid','Aceita criança'],['pet','Aceita pet']];
function hasMoments(){return pubPlaces().some(function(p){return Array.isArray(p.mo)&&p.mo.length})}
function match(p){var t=(p.n+' '+p.g+' '+p.c+' '+p.d+' '+p.e+' '+p.r).toLowerCase();
 if(S.q&&t.indexOf(S.q.toLowerCase())<0)return false;
 if(S.cat!=='Tudo'&&p.g!==S.cat)return false;
 if(S.region!=='Tudo'&&region(p)!==S.region)return false;
 if(S.flags.indexOf('tel')>-1&&!p.t)return false;
 for(var i=0;i<S.flags.length;i++){if(S.flags[i].indexOf('mo:')===0&&!(Array.isArray(p.mo)&&p.mo.indexOf(S.flags[i].slice(3))>-1))return false}
 if(S.flags.indexOf('open')>-1&&openNow(p)!==true)return false;
 for(var q=0;q<S.flags.length;q++){var fk=S.flags[q];if(fk.indexOf('df:')===0&&!(Array.isArray(p.dif)&&p.dif.indexOf(fk.slice(3))>-1))return false;if(fk.indexOf('ck:')===0&&cuisines(p).indexOf(fk.slice(3))<0)return false}
 var dd=S.flags.filter(function(x){return x.indexOf('day:')===0}).map(function(x){return +x.slice(4)});if(dd.length&&!(Array.isArray(p.h)&&p.h.some(function(sl){return sl&&Array.isArray(sl.d)&&dd.some(function(d){return sl.d.indexOf(d)>-1})})))return false
 if(S.flags.indexOf('shop')>-1&&region(p)!=='Shopping Pátio')return false;
 if(S.flags.indexOf('amb')>-1&&!(amb[p.id]&&amb[p.id].length))return false;
 if(S.flags.indexOf('kid')>-1&&p.kid!==true)return false;
 if(S.flags.indexOf('pet')>-1&&p.pet!==true)return false;
 return true}
function yn(v){return v===true?'Aceita':v===false?'Não aceita':'Não informado'}
function sorted(a){if(S.sort==='comp')return byComplete(a);if(S.sort==='dist')return a.slice().sort(function(x,y){var dx=NATIVE.distance(x),dy=NATIVE.distance(y);if(dx==null&&dy==null)return x.n.localeCompare(y.n);if(dx==null)return 1;if(dy==null)return -1;return dx-dy});return a.slice().sort(function(x,y){return S.sort==='reg'?(region(x).localeCompare(region(y))||x.n.localeCompare(y.n)):x.n.localeCompare(y.n)})}
function pic(p){var a=photosOk[p.id];return a?a.u:p.foto}
function photos(p){var l=(Array.isArray(p.fotos)?p.fotos:[]).filter(Boolean);if(!l.length&&pic(p))l=[pic(p)];return l.slice(0,3)}
function complete(p){return(photos(p).length?3:0)+(p.t?1:0)+(p.h?1:0)+(typeof p.lat==='number'?1:0)}
function byComplete(a){return a.slice().sort(function(x,y){return complete(y)-complete(x)||x.n.localeCompare(y.n)})}
var COV={'Restaurantes':['#e4efe3','#2f6a4f'],'Hamburguerias':['#fde1d3','#b4472a'],'Pizzarias':['#fff0c9','#8a5d00'],'Lanchonetes':['#fbe4e0','#a3412c'],'Pastelarias':['#ffe9d0','#8d4f10'],'Cafeterias e padarias':['#efe3d6','#6b4a33'],'Açaíterias':['#f1e4f3','#6d2f7a']};
function photo(p,cls){var u=pic(p),c=COV[p.g]||['#efe9df','#5c564e'],ini=(p.n.replace(/[^A-Za-zÀ-ÿ0-9]/g,' ').trim()[0]||'M').toUpperCase();
 return '<span class="'+cls+' cov" style="--c1:'+c[0]+';--c2:'+c[1]+'" aria-hidden="true"><b>'+esc(ini)+'</b>'+(u?'<img src="'+esc(u)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</span>'}
function heartBtn(p){var on=saved.has(p.id);return '<button class="heart'+(on?' on':'')+'" data-heart="'+esc(p.id)+'" aria-pressed="'+on+'" aria-label="'+(on?'Remover ':'Salvar ')+esc(p.n)+(on?' dos salvos':'')+'">salvar</button>'}
function vmedia(p){var l=photos(p);if(!l.length)return photo(p,'pimg vnone');var c=COV[p.g]||['#efe9df','#5c564e'],ini=(p.n.replace(/[^A-Za-zÀ-ÿ0-9]/g,' ').trim()[0]||'M').toUpperCase();return '<span class="vph n'+l.length+'" style="--c1:'+c[0]+';--c2:'+c[1]+'" data-i="'+esc(ini)+'" aria-hidden="true">'+l.map(function(u){return '<img src="'+esc(u)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="var s=this.parentNode;this.remove();if(!s.querySelector(\'img\'))s.classList.add(\'empty\')">'}).join('')+'</span>'}
function placeCard(p){return '<div class="cw p">'+heartBtn(p)+'<button class="place vcard" data-open="'+esc(p.id)+'">'+vmedia(p)+'<span class="pinfo"><div class="ptitle">'+esc(p.n)+'</div><div class="pcat"><b>'+esc(p.g)+'</b> · '+esc(region(p))+(NATIVE.distance(p)!=null?' · '+NATIVE.fmt(NATIVE.distance(p)):'')+'</div><div class="ptags">'+esc(shortAddr(p))+'</div>'+(p.kid===true?'<span class="qtag">Aceita crianças</span>':'')+(p.pet===true?'<span class="qtag">Aceita pets</span>':'')+(p.suggested?'<span class="presencial">Aguardando revisão</span>':'')+'</span></button></div>'}
var LOADING=!!(typeof API!=='undefined'&&typeof MESAI_CONFIG!=='undefined'&&MESAI_CONFIG.supabaseUrl);
function skel(n){var h='';for(var i=0;i<n;i++)h+='<div class="skel" aria-hidden="true"><i></i><span><b></b><em></em><em></em></span></div>';return h}
function emptyBox(msg){return '<div class="empty">'+msg+'<br><button class="btn ghost" data-reset>Limpar filtros</button></div>'}
var recent=load('mesai-recent',[]);
function addRecent(id){recent=[id].concat(recent.filter(function(x){return x!==id})).slice(0,8);store('mesai-recent',recent);renderRecent()}
function renderRecent(){var box=$('recentBox');if(!box)return;var rows=LOADING?[]:recent.map(byId).filter(function(p){return p&&visible(p)});box.hidden=!rows.length;$('recentList').innerHTML=rows.map(function(p){return '<button class="rtile" data-open="'+esc(p.id)+'">'+photo(p,'rimg')+'<span>'+esc(p.n)+'</span></button>'}).join('')}
function androidStrip(){var el=document.getElementById('apkStrip');if(!el)return;var show=/Android/i.test(navigator.userAgent)&&!NATIVE.isNative&&!load('mesai-apk-hide',false);el.hidden=!show}
function hcard(p){var l=photos(p),c=COV[p.g]||['#efe9df','#5c564e'],ini=(p.n.replace(/[^A-Za-zÀ-ÿ0-9]/g,' ').trim()[0]||'M').toUpperCase();return '<div class="cw h">'+heartBtn(p)+'<button class="hcard" data-open="'+esc(p.id)+'"><span class="hph'+(l.length?'':' empty')+'" style="--c1:'+c[0]+';--c2:'+c[1]+'" data-i="'+esc(ini)+'" aria-hidden="true">'+(l.length?'<img src="'+esc(l[0])+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="var s=this.parentNode;this.remove();s.classList.add(\'empty\')">':'')+'</span><b>'+esc(p.n)+'</b><small>'+esc(region(p))+'</small></button></div>'}
function renderSections(){var pp=pubPlaces(),out=[];CATS.forEach(function(c){if(c[0]==='Tudo')return;var l=byComplete(pp.filter(function(p){return p.g===c[0]}));if(!l.length)return;var sc=l.slice(0,4).reduce(function(a,p){return a+complete(p)},0);out.push([sc,c[0],'<section class="section hsec"><div class="section-head"><div><h2>'+esc(c[0])+'</h2></div><button class="link" data-homecat="'+esc(c[0])+'">'+l.length+(l.length===1?' lugar':' lugares')+ico('next')+'</button></div><div class="hrow">'+l.map(hcard).join('')+'</div></section>'])});out.sort(function(a,b){return b[0]-a[0]});var k=-1;out.forEach(function(o,i){if(o[1]==='Hamburguerias')k=i});var html=function(l){return l.map(function(o){return o[2]}).join('')};$('catSections').innerHTML=html(out.slice(0,k+1));$('catSections2').innerHTML=html(out.slice(k+1))}
/* Filtro completo. Só valem dados verificados: opções sem nenhum lugar com o dado ficam desativadas (cinza) e ligam sozinhas quando o dado entrar (campos dif, h, mo, kid, pet em js/data.js ou no servidor). */
var DIFS=[['wifi','Wi-Fi'],['ar','Ar-condicionado'],['externa','Área externa'],['acess','Acessibilidade'],['estac','Estacionamento'],['estacgr','Estacionamento gratuito'],['kids','Espaço Kids'],['jogos','Sala de jogos'],['musica','Música ao vivo'],['veg','Pratos vegetarianos'],['vegano','Pratos veganos'],['gluten','Sem glúten'],['lactose','Sem lactose'],['cerveja','Cervejas artesanais'],['vinhos','Carta de vinhos'],['rodizio','Rodízio'],['selfs','Self-service'],['reserva','Aceita reserva'],['feriado','Abre em feriados'],['bike','Bike friendly'],['cartao','Aceita cartão'],['pix','Aceita Pix'],['vr','Vale-refeição']];
var DIAS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
var COZ=[['churrasco','Churrasco'],['regional','Regional'],['selfservice','Self-service'],['oriental','Oriental'],['bistro','Bistrô'],['frango','Frango'],['fastfood','Fast-food'],['sanduiche','Sanduíches'],['doces','Doces e confeitaria']];
function cuisines(p){var c=((p.c||'')+' '+(p.d||'')).toLowerCase(),o=[];if(/churrasc|grill/.test(c))o.push('churrasco');if(/regional|tapioca|cuscuz|sert/.test(c))o.push('regional');if(/self-service/.test(c))o.push('selfservice');if(/orient|japon|sushi|chin/.test(c))o.push('oriental');if(/bistr/.test(c))o.push('bistro');if(/frango/.test(c))o.push('frango');if(/fast-food/.test(c))o.push('fastfood');if(/sandu|sanduíche|sanduiche/.test(c))o.push('sanduiche');if(/doce|confeit|bolo/.test(c))o.push('doces');return o}
function cntFlag(k){var P=pubPlaces();if(k.indexOf('df:')===0)return P.filter(function(p){return Array.isArray(p.dif)&&p.dif.indexOf(k.slice(3))>-1}).length;if(k.indexOf('ck:')===0)return P.filter(function(p){return cuisines(p).indexOf(k.slice(3))>-1}).length;if(k.indexOf('day:')===0)return P.filter(function(p){return Array.isArray(p.h)&&p.h.some(function(s){return s&&Array.isArray(s.d)&&s.d.indexOf(+k.slice(4))>-1})}).length;if(k==='kid')return P.filter(function(p){return p.kid===true}).length;if(k==='pet')return P.filter(function(p){return p.pet===true}).length;if(k==='open')return P.filter(function(p){return openNow(p)!==null}).length;return 1}
function filtersHtml(){var n=pubPlaces().filter(match).length;
 function chips(list,on,attr,cnt){return list.map(function(f){var a=on(f[0]),c=cnt?cnt(f[0]):1,off=c===0&&!a;return '<button class="filter'+(a?' active':'')+(off?' off':'')+'" data-'+attr+'="'+esc(f[0])+'" aria-pressed="'+a+'"'+(off?' disabled':'')+'>'+esc(f[1])+(cnt&&c>0?' <i>'+c+'</i>':'')+'</button>'}).join('')}
 function grp(t,body,note){return '<div class="fgroup"><span class="flabel">'+t+'</span>'+body+(note?'<p class="fnote">'+note+'</p>':'')+'</div>'}
 var fl=function(k){return S.flags.indexOf(k)>-1};
 var cats=CATS.map(function(c){return [c[0],c[1]]}),regs=REGIONS.map(function(r){return [r,r==='Tudo'?'Toda a região':r]});
 var sorts=[['comp','Mais completos'],['az','A–Z'],['reg','Por região'],['dist','Mais perto']];
 var dias=DIAS.map(function(d,i){return ['day:'+i,d]});
 var coz=COZ.map(function(c){return ['ck:'+c[0],c[1]]}),dif=DIFS.map(function(c){return ['df:'+c[0],c[1]]});
 var semHor=dias.every(function(d){return cntFlag(d[0])===0});
 var semDif=dif.every(function(d){return cntFlag(d[0])===0});
 return grp('Ordenar','<div class="fchips">'+chips(sorts,function(k){return S.sort===k},'fsort')+'</div>')
 +grp('Categoria','<div class="fchips">'+chips(cats,function(k){return S.cat===k},'fcat')+'</div>')
 +grp('Tipo de cozinha','<div class="fchips">'+chips(coz,fl,'fflag',cntFlag)+'</div>')
 +grp('Região','<div class="fchips">'+chips(regs,function(k){return S.region===k},'freg')+'</div>')
 +grp('Dias da semana','<div class="fchips fdias">'+chips(dias,fl,'fflag',cntFlag)+'</div>',semHor?'Os horários ainda estão sendo coletados; este filtro liga quando houver.':'Mostra lugares que abrem no(s) dia(s) marcado(s).')
 +(hasMoments()?grp('Momento da refeição','<div class="fchips">'+chips(MOMENTS.map(function(m){return ['mo:'+m[0],m[1]]}),fl,'fflag')+'</div>'):'')
 +grp('Diferenciais','<div class="fchips">'+chips(dif,fl,'fflag',cntFlag)+'</div>',semDif?'Opções em cinza ainda não têm dado confirmado nos lugares; ligam conforme completamos.':'Opções em cinza ainda não têm dado confirmado.')
 +grp('Mostrar só','<div class="fchips">'+chips(FLAGS,fl,'fflag',cntFlag)+'</div>')
 +'<div class="fbar"><button class="btn block" data-fapply>'+(n?'Ver '+n+(n===1?' lugar':' lugares'):'Nenhum lugar com esses filtros')+'</button><button class="link" data-fclear>Limpar tudo</button></div>'}
function renderHome(){
 renderSections();var fc=(S.cat!=='Tudo'?1:0)+(S.region!=='Tudo'?1:0)+S.flags.length;$('homeFilt').querySelector('span').textContent='Filtros'+(fc?' ('+fc+')':'');
 var pp=pubPlaces();var d=new Date(),k=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%Math.max(pp.length,1),h=pp[k];
 $('hero').innerHTML=h?'<div class="hero"><button class="hero-main" data-open="'+esc(h.id)+'">'+photo(h,'hphoto')+'<span class="hbody"><b>'+esc(h.n)+'</b><small>'+esc(h.g)+' · '+esc(region(h))+'</small><i>'+esc(h.d)+'</i></span></button><div class="hero-act"><button class="btn" data-open="'+esc(h.id)+'">Ver detalhes</button><button class="btn ghost" data-surprise>Surpreenda-me</button></div></div>':'';
 if(LOADING){$('hero').innerHTML='<div class="skel big" aria-hidden="true"></div>';$('homeList').innerHTML=skel(3);$('homeList').setAttribute('aria-busy','true');$('homeCount').textContent='Ver todos';renderRecent();return}
 $('homeList').removeAttribute('aria-busy');$('homeList').innerHTML=byComplete(pp).slice(0,6).map(placeCard).join('');renderRecent();
 $('homeCount').textContent='Ver todos ('+pp.length+')';
}
function renderSearch(){
 $('catChips').innerHTML=CATS.map(function(c){return '<button class="chip'+(S.cat===c[0]?' active':'')+'" data-cat="'+esc(c[0])+'" aria-pressed="'+(S.cat===c[0])+'">'+(c[2]?'<img src="'+c[2]+'" alt="">':'')+c[1]+'</button>'}).join('');
 var regHtml=REGIONS.map(function(f){var on=S.region===f;return '<button class="filter'+(on?' active':'')+'" data-region="'+esc(f)+'" aria-pressed="'+on+'">'+(f==='Tudo'?'Toda a região':f)+'</button>'}).join('');
 var flagHtml=(hasMoments()?MOMENTS.map(function(m){return ['mo:'+m[0],m[1]]}):[]).concat([['open','Aberto agora'],['tel','Tem telefone'],['shop','No shopping'],['amb','Ambiente que marquei'],['kid','Aceita criança'],['pet','Aceita pet']]).map(function(f){var on=S.flags.indexOf(f[0])>-1;return '<button class="filter'+(on?' active':'')+'" data-flag="'+f[0]+'" aria-pressed="'+on+'">'+f[1]+'</button>'}).join('');
 var anyOn=S.region!=='Tudo'||S.flags.length>0;
 $('filters').innerHTML='<div class="fgroup" role="group" aria-label="Região"><span class="flabel">Região</span><div class="fchips">'+regHtml+'</div></div><div class="fgroup" role="group" aria-label="Mostrar só"><span class="flabel">Mostrar só</span><div class="fchips">'+flagHtml+'</div></div>'+(anyOn?'<button class="link fclear" data-reset>Limpar filtros</button>':'');
 var rows=sorted(pubPlaces().filter(match));
 $('sortBtn').textContent='Ordenar: '+(S.sort==='reg'?'por região':S.sort==='dist'?'perto de mim':S.sort==='az'?'A–Z':'completos');
 $('filtBtn').textContent='Filtros'+((S.region!=='Tudo'?1:0)+S.flags.length?' ('+((S.region!=='Tudo'?1:0)+S.flags.length)+')':'');
 (function(){var c=$('catChips'),a=c.querySelector('.active');if(a)c.scrollLeft=Math.max(0,a.offsetLeft-(c.clientWidth-a.offsetWidth)/2)})();
 if(LOADING){$('count').textContent='Carregando lugares…';$('list').innerHTML=skel(5);$('list').setAttribute('aria-busy','true');return}$('list').removeAttribute('aria-busy');
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
var prof=load('mesai-profile',{name:'Visitante'});var notif=load('mesai-notif',{novos:true,comunidade:true});
function renderProfile(){var nm=(S2.on&&API.user()&&S2.name)||prof.name||'Visitante';$('pName').textContent=nm;$('rvName').textContent=nm;
 var n=places.filter(function(p){return saved.has(p.id)}).length;$('rvSaved').textContent=n;$('rvPts').textContent=points();$('rvSugg').textContent=sugg.length}
function listRows(arr,act,lbl){return arr.length?arr.map(function(p){return '<div class="mini"><button class="o" data-open="'+esc(p.id)+'">'+esc(p.n)+'<small>'+esc(p.g)+'</small></button><button class="x" data-'+act+'="'+esc(p.id)+'">'+lbl+'</button></div>'}).join(''):''}
function bairroRow(n,on){return '<button class="opt brr'+(n===bairro?' sel':'')+'" data-bairro="'+esc(n)+'" aria-pressed="'+(n===bairro)+'"><span>'+esc(n)+'</span><i>'+(n===bairro?ico('check'):'')+'</i></button>'}
function accountHtml(){
 if(!S2.on)return '<p class="sheet-copy">A conta ainda não está disponível: não consegui falar com o servidor do Mesaí. Seus dados ficam só neste aparelho.</p><button class="btn ghost block" data-cleardata>Apagar dados deste aparelho</button>';
 var u=API.user();
 if(u)return '<p class="sheet-copy">Você está conectado como <b>'+esc(u.email)+'</b>.'+(S2.admin?' Você modera a comunidade.':'')+'</p><div class="pts"><b>'+S2.points+'</b><span>pontos na sua conta</span></div><button class="btn block" data-auth="out">Sair da conta</button><div class="note">Seus favoritos, check-ins e comentários ficam guardados na sua conta.</div><button class="btn ghost block" data-cleardata>Apagar dados deste aparelho</button>'+(S2.admin?'<p class="fine">Conta de dona(o) do app não pode ser excluída por aqui.</p>':'<button class="btn ghost block danger" data-delacct>Excluir minha conta</button><p class="fine">Apaga para sempre sua conta, perfil, foto, comentários, check-ins, pontos e favoritos. Não dá para desfazer.</p>');
 return authHtml()}
var IC={user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 8 8 6 8-6"/></svg>',lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/></svg>'};
function authField(name,label,icon,type,extra,pw){return '<label class="af">'+label+'<span class="af-box">'+IC[icon]+'<input name="'+name+'" type="'+type+'" '+extra+'>'+(pw?'<button type="button" class="af-eye" data-eye aria-label="Mostrar senha" aria-pressed="false">'+IC.eye+'</button>':'')+'</span></label>'}
function authHtml(){
 var G='<svg class="g-ico" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.500-5.800c-2.100 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>';
 var HS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/><path d="M19 20c0 1.100-1.300 2-3 2h-2"/></svg>';
 return '<div class="auth" data-mode="in"><div class="auth-card"><h2 class="auth-title" id="authTitle">Entrar na conta</h2><p class="auth-sub" id="authSub">Entre para comentar, ganhar pontos e guardar seus favoritos na nuvem.</p>'
 +'<form class="form authform" id="authForm" novalidate>'
 +'<div class="af-name" hidden>'+authField('name','Nome','user','text','maxlength="40" autocomplete="name" placeholder="Como quer ser chamada(o)?"')+'</div>'
 +authField('email','E-mail','mail','email','required autocomplete="email" placeholder="seunome@email.com"')
 +authField('password','Senha','lock','password','minlength="6" required autocomplete="current-password" placeholder="Sua senha"',true)
 +'<div class="af-confirm" hidden>'+authField('password2','Confirme sua senha','lock','password','autocomplete="new-password" placeholder="Confirme sua senha"',true)+'</div>'
 +'<div class="af-row"><label class="af-check"><input type="checkbox" name="remember" checked><span>Lembrar login</span></label><button type="button" class="af-forgot" id="authForgot">Esqueci minha senha</button></div>'
 +'<label class="af-check af-terms" hidden><input type="checkbox" name="terms"><span>Li e aceito os <a href="termos.html">Termos de Uso</a> e a <a href="privacidade.html">Política de Privacidade</a></span></label>'
 +'<p class="af-msg" id="authMsg" role="status" aria-live="polite"></p>'
 +'<button class="btn block authgo" type="submit" data-auth="in" id="authGo">Entrar</button></form>'
 +'<div class="auth-or"><span>OU</span></div>'
 +'<button class="gbtn" type="button" id="authGoogle">'+G+'<span id="authGoogleTxt">Fazer login com o Google</span></button></div>'
 +'<div class="auth-switch">Ainda não tem conta? <button type="button" id="authSwitch">Crie uma!</button></div>'
 +'<a class="auth-help" href="mailto:beyonddesign.empresa@gmail.com">'+HS+'<span>Problemas para acessar? Fale conosco</span></a>'
 +'<p class="auth-foot" id="authFoot" hidden>Ao cadastrar você concorda com os termos informados no formulário.</p>'
 +'<div class="auth-done" hidden><div class="auth-ok">'+IC.check+'</div><h3>Cadastro realizado!</h3><p>Enviamos um e-mail para <b id="authSent"></b>. Abra o link que mandamos para ativar a conta e depois volte aqui para entrar.</p><button class="btn block" type="button" id="authBack">Ir para o login</button></div></div>'}
function openSheet(k){lastFocus=document.activeElement;var T='',B='';
 if(k==='filtros'){T='Filtros';B='<div id="fsheet">'+filtersHtml()+'</div>'}
 else if(k==='bairro'){T='Escolher bairro';B='<p class="sheet-copy">Por enquanto o Mesaí cobre só este bairro. Os outros chegam aos poucos.</p>'+BAIRROS_ATIVOS.map(function(n){return bairroRow(n)}).join('')+'<h3 class="sec-t">Em breve</h3>'+BAIRROS_MCZ.filter(function(n){return BAIRROS_ATIVOS.indexOf(n)<0}).map(function(n){return '<div class="opt brr off"><span>'+esc(n)+'</span><em>em breve</em></div>'}).join('')}
 else if(k==='edit'){T='Gerenciar perfil';B='<form class="form" id="profForm"><label>Seu nome<input name="name" maxlength="40" value="'+esc(prof.name||'')+'" required></label><button class="btn block" type="submit">Salvar</button></form><div class="note only-local">O nome fica salvo só neste aparelho. Ainda não há conta nem e-mail.</div>'}
 else if(k==='security'){T='Conta e segurança';B=accountHtml()}
 else if(k==='notif'){T='Notificações';B=notifsHtml()+'<label class="opt">Novos lugares na região<input type="checkbox" data-notif="novos"'+(notif.novos?' checked':'')+'></label><label class="opt">Respostas e aprovação dos meus comentários<input type="checkbox" data-notif="comunidade"'+(notif.comunidade?' checked':'')+'></label><div class="note">Os avisos de lugar novo aparecem aqui dentro do app, no sininho. Aviso com o app fechado (push) vem numa próxima versão.'+(hasPlus()?'':' Depois do teste de 14 dias, os alertas de lugar novo são um recurso do Mesaí+.')+'</div>'}
 else if(k==='lang'){T='Idioma';B='<label class="opt">Português (Brasil)<input type="radio" name="lg" checked></label><label class="opt"><span>English <small>em breve</small></span><input type="radio" name="lg" disabled></label><label class="opt"><span>Español <small>em breve</small></span><input type="radio" name="lg" disabled></label>'}
 else if(k==='theme'){T='Tema';B='<label class="opt">Claro<input type="radio" name="th" checked></label><label class="opt"><span>Escuro <small>em breve</small></span><input type="radio" name="th" disabled></label><label class="opt"><span>Automático <small>em breve</small></span><input type="radio" name="th" disabled></label>'}
 else if(k==='points'){T='Meus pontos';var hist=checkins.slice().reverse().map(function(c){var p=byId(c.id);return '<div class="mini"><span>'+esc(p?p.n:'Lugar')+'<small>'+esc(c.d)+'</small></span><b>+10</b></div>'}).join('');B='<div class="pts"><b>'+points()+'</b><span>pontos neste aparelho</span></div><p class="sheet-copy">Ganhe 10 pontos por marcar “Estive aqui” em um lugar (1 vez por lugar por dia). Em breve: pontos por avaliações aprovadas e fotos.</p><div class="note only-local">Os pontos ainda são locais. Viram pontos de verdade, com níveis e recompensas, quando existir conta e servidor.</div>'+(hist||'<div class="empty">Sem check-ins ainda.</div>')}
 else if(k==='saved'){T='Lugares salvos';var sv=places.filter(function(p){return saved.has(p.id)});B=sv.length?listRows(sv,'unsave','Remover'):'<div class="empty">Você ainda não salvou nenhum lugar. Abra um lugar e toque em “Salvar lugar”.</div>'}
 else if(k==='sugg'){T='Minhas sugestões';B=(sugg.length?listRows(sugg,'delsug','Excluir'):'<div class="empty">Nenhuma sugestão ainda.</div>')+'<button class="btn block" data-open-suggest>Sugerir um lugar</button>'}
 else if(k==='help'){T='Central de ajuda';B='<div class="faq"><b>De onde vêm os lugares?</b><p>De listagens públicas pesquisadas em 09/11/2026. Ainda não visitamos cada local.</p><b>Como sei se tem mesas?</b><p>O detalhe mostra a evidência encontrada. Ligue antes de ir para confirmar.</p><b>Por que alguns lugares estão sem foto?</b><p>Só usamos fotos com autorização. Sem ela, mostramos o desenho do tipo de comida.</p><b>Por que meu comentário não aparece?</b><p>Todo comentário passa por aprovação antes de ficar visível.</p><b>Por que não há mapa?</b><p>Ainda não validamos coordenadas dos endereços. Use “Traçar rota” em cada lugar.</p></div>'}
 else if(k==='about'){T='Sobre o Mesaí';B='<p class="sheet-copy">O Mesaí ajuda a descobrir restaurantes e lanchonetes onde dá para comer no local, começando pela parte alta de Maceió. Não é um app de entrega: não há pedido, pagamento nem reserva.</p><div class="note">Versão de lançamento. Endereços e categorias vêm de listagens públicas e são conferidos um a um; horários e preços podem mudar, então confirme com o lugar antes de ir.</div><button class="btn ghost block" data-onboard>Rever a introdução</button><a class="btn block" href="download/mesai.apk" download>Baixar o app para Android</a><p class="fine">No iPhone: abra no Safari e toque em Compartilhar › Adicionar à Tela de Início.</p><p class="fine">Fotos das categorias: Freepik (freepik.com).</p><p class="sheet-copy"><a href="termos.html">Termos de Uso</a> · <a href="privacidade.html">Política de Privacidade</a></p>'}
 else if(k==='pend'){closeOverlays();go('admin');return}
 $('infoHead').textContent=T;$('infoBody').innerHTML=B;$('infoOverlay').classList.add('open');var c=$('infoOverlay').querySelector('.close');c.focus();
 var f=$('profForm');if(f)f.onsubmit=function(e){e.preventDefault();prof.name=String(new FormData(f).get('name')||'').trim()||'Visitante';store('mesai-profile',prof);renderProfile();setMyAvatar();closeOverlays();toast('Perfil atualizado')}}
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
 $('feed').innerHTML=feedItems().map(function(x){var sv=!!x.sv,mine=sv?x.mine:x.id>0,p=x.place&&byId(x.place);return '<article class="post"><div class="post-h">'+(mine?'<img class="myav" src="" alt="">':'<span class="ini" aria-hidden="true">'+esc((x.who||'M')[0])+'</span>')+'<div><b>'+(mine?'Você':esc(x.who||'Membro')+(sv?'':' <em class="tst">teste</em>'))+'</b><small>'+ago(sv?x.t:(mine?x.id:x.t))+(p?' · '+esc(p.n):'')+'</small></div><span class="kind k-'+esc(x.kind)+'">'+esc(x.kind)+'</span></div><p>'+esc(x.text)+'</p>'+(mine&&x.status==='pendente'?'<span class="badge">Aguardando aprovação · só você vê</span>':mine&&x.status==='rejeitado'?'<span class="badge no">Não aprovado</span>':'')+'<div class="post-f">'+(sv?'':'<button data-like="'+x.id+'" class="'+(x.liked?'on':'')+'" aria-pressed="'+!!x.liked+'">'+ico('heart',!!x.liked)+' Curtir</button>')+(mine?'<button data-delpost="'+x.id+'">Excluir</button>':'')+'</div></article>'}).join('')||'<div class="empty" style="margin-top:12px">Ninguém comentou ainda. Seja o primeiro: conte como foi, deixe uma dica ou um elogio.</div>'}
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
function setMyAvatar(){var nm=(S2.on&&API.user()&&(S2.name||''))||prof.name||'';var src=(S2.on&&API.user()&&S2.avatar)||initialAvatar(nm);document.querySelectorAll('.myav').forEach(function(i){i.src=src})}
var avFile=$('avFile');if(avFile)avFile.onchange=function(){var f=avFile.files&&avFile.files[0];if(!f)return;if(!(S2.on&&API.user())){toast('Entre na conta para trocar a foto');avFile.value='';return}API.uploadAvatar(f).then(function(url){S2.avatar=url;setMyAvatar();toast('Foto atualizada')}).catch(function(){toast('Não foi possível trocar a foto')}).then(function(){avFile.value=''})};
function renderAll(){renderBairro();renderPlan();renderMod();renderFeed();renderHome();renderSearch();renderProfile();renderAdmin();setMyAvatar();updateGreet();updateNotifBadge();androidStrip()}
var lastFocus=null;
function telHref(t){var d=String(t).replace(/\D/g,'');return d.length>=10?'+55'+d:d}
function openDetail(id){var p=byId(id);if(!p)return;if(recent[0]!==id)addRecent(id);lastFocus=document.activeElement;var s=saved.has(id);
 var dest=encodeURIComponent(p.n+', '+p.e);
 $('detail').innerHTML='<div class="dphoto">'+galHtml(p)+'</div>'+'<h2 class="detail-title">'+esc(p.n)+'</h2><p class="detail-sub">'+esc(p.g)+(p.d?' · '+esc(p.d):'')+'</p><a class="btn block go" href="https://www.google.com/maps/dir/?api=1&destination='+dest+'" target="_blank" rel="noopener noreferrer"><span class="go-ico">'+ico('route')+'</span><span class="go-t"><b>Traçar rota</b><small>Abrir no Google Maps</small></span>'+ico('next')+'</a><div class="dact">'+(p.t?'<a class="btn ghost act" href="tel:'+telHref(p.t)+'">'+ico('phone')+'<span>Ligar</span></a>':'')+'<button class="btn ghost act'+(s?' saved':'')+'" id="saveBtn" aria-pressed="'+s+'">'+ico('heart',!!s)+'<span>'+(s?'Salvo':'Salvar')+'</span></button><button class="btn ghost act" data-share="'+esc(p.id)+'">'+ico('share')+'<span>Compartilhar</span></button></div><dl class="dinfo"><div><dt>Endereço</dt><dd>'+esc(p.e)+'</dd></div>'+(p.t?'<div><dt>Telefone</dt><dd>'+esc(p.t)+'</dd></div>':'')+(p.kid===true||p.kid===false?'<div><dt>Crianças</dt><dd>'+yn(p.kid)+'</dd></div>':'')+(p.pet===true||p.pet===false?'<div><dt>Pets</dt><dd>'+yn(p.pet)+'</dd></div>':'')+'<div><dt>Atendimento no local</dt><dd>'+esc(EVID[p.ev]||'Não informado')+'. Sem visita física da equipe.</dd></div></dl>'+(function(){var f=[];if(!p.h)f.push('horários');if(p.kid!==true&&p.kid!==false)f.push('crianças');if(p.pet!==true&&p.pet!==false)f.push('pets');return f.length?'<p class="dmiss">Ainda não informado: '+f.join(', ')+'.</p>':''})()+''+(p.m?'<a class="btn ghost block" href="'+esc(p.m)+'" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>':'')+'<h3 class="sec-t">Ambiente</h3><p class="sec-s">Marque o que você viu. Com servidor, as marcações de todos aparecem aqui; por enquanto valem só no seu aparelho.</p><div class="ambs">'+AMB.map(function(a){var on=(amb[p.id]||[]).indexOf(a)>-1;var n=(S2.amb[p.id]&&S2.amb[p.id][a])||0;return '<button class="amb'+(on?' on':'')+'" data-amb="'+esc(p.id)+'|'+esc(a)+'" aria-pressed="'+on+'">'+(on?ico('check')+' ':'')+esc(a)+(n?' · '+n:'')+'</button>'}).join('')+'</div><button class="btn ghost block" data-checkin="'+esc(p.id)+'">'+ico('pin')+' Estive aqui · +10 pontos</button>'+
  '';
 $('saveBtn').onclick=function(){toggleSave(id);openDetail(id)};
 $('detailOverlay').classList.add('open');$('detailOverlay').querySelector('.close').focus()}
function toggleSave(id){setTimeout(refreshSheet,0);var was=saved.has(id);if(was){saved.delete(id);toast('Removido dos salvos')}else{saved.add(id);toast('Lugar salvo');NATIVE.haptic('ok')}
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
document.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;var D=t.dataset;if(D.apkHide!==undefined){store('mesai-apk-hide',true);androidStrip();return}if(D.share!==undefined){var sp=BASE.filter(function(x){return x.id===D.share})[0]||places.filter(function(x){return x.id===D.share})[0];if(sp){NATIVE.share({title:sp.n+' · Mesaí',text:sp.n+' — '+sp.g+' em '+region(sp)+'. Achei no Mesaí:',url:'https://lucastenoriodesign.github.io/vsa-design-system/'}).then(function(r){if(r==='copied')toast('Link copiado')}).catch(function(){})}return}
 if(D.quick){var q=D.quick;resetSearch();if(q==='aberto'){S.mode='list';if(pubPlaces().some(function(p){return openNow(p)!==null})){S.flags=['open'];toast('Mostrando só quem está aberto agora')}else toast('Ainda não temos horários confirmados. Mostrando todos os lugares.');renderSearch();go('buscar')}
  else if(q==='shopping'){S.flags=['shop'];S.mode='list';renderSearch();go('buscar')}
  else if(q==='mapa'){S.mode='map';renderSearch();go('buscar')}
  else if(q==='perto'){toast('Buscando sua localização…');NATIVE.locate().then(function(){S.sort='dist';S.mode='list';renderSearch();go('buscar');if(!pubPlaces().some(function(p){return NATIVE.distance(p)!=null}))toast('Ainda poucos lugares têm coordenada confirmada')}).catch(function(){toast('Não consegui sua localização. Ative o GPS e tente de novo.')})}
  return}
 if(D.fcat!==undefined||D.freg!==undefined||D.fflag!==undefined||D.fsort!==undefined||D.fclear!==undefined||D.fapply!==undefined){if(D.fapply!==undefined){closeOverlays();S.mode='list';renderSearch();renderHome();go('buscar');return}if(D.fclear!==undefined){S.cat='Tudo';S.region='Tudo';S.flags=[];S.sort='comp'}if(D.fcat!==undefined)S.cat=D.fcat;if(D.freg!==undefined)S.region=D.freg;if(D.fsort!==undefined)S.sort=D.fsort;if(D.fflag!==undefined){var fi2=S.flags.indexOf(D.fflag);if(fi2>-1)S.flags.splice(fi2,1);else S.flags.push(D.fflag)}$('fsheet').innerHTML=filtersHtml();renderHome();return}
 if(D.go){go(D.go);return}
 if(D.onboard!==undefined){closeOverlays();onbOpen();return}
 if(D.interest){var key=D.interest;if(interest.indexOf(key)<0)interest.push(key);store('mesai-interest',interest);renderPlan();toast('Anotado neste navegador. Ainda não há cobrança.');return}
 if(D.bairro){bairro=D.bairro;store('mesai-bairro',bairro);resetSearch();renderBairro();renderAll();closeOverlays();toast('Bairro: '+bairro);return}
 if(D.notifRead!==undefined){buildNotifs();store('mesai-notif-read',NOTIFS.map(function(n){return n.id}));updateNotifBadge();openSheet('notif');toast('Notificações marcadas como lidas');return}
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
$('sortBtn').onclick=function(){NATIVE.haptic();if(S.sort==='comp'){S.sort='az';return renderSearch()}if(S.sort==='az'){S.sort='reg';return renderSearch()}if(S.sort==='reg'){$('sortBtn').textContent='Buscando sua localização…';return NATIVE.locate().then(function(){S.sort='dist';renderSearch()}).catch(function(){S.sort='comp';renderSearch();toast('Sem acesso à localização. Ative nas configurações para ver o que está perto.')})}S.sort='comp';renderSearch()};
$('modeList').onclick=function(){S.mode='list';renderSearch()};
$('modeMap').onclick=function(){S.mode='map';renderSearch()};
$('searchInput').oninput=function(e){S.q=e.target.value.trim();renderSearch()};
$('homeSearch').onsubmit=function(e){e.preventDefault();var q=$('homeInput').value.trim();resetSearch();S.q=q;$('searchInput').value=q;$('homeInput').value='';renderSearch();go('buscar')};
$('locationButton').onclick=function(){openSheet('bairro')};
function clearAll(){if(!confirm('Apagar favoritos, sugestões, mensagens, fotos aplicadas e perfil deste navegador?'))return;['mesai-saved','mesai-suggestions','mesai-published','mesai-posts','mesai-photos','mesai-profile','mesai-notif','mesai-seen-places','mesai-new-alerts','mesai-notif-read','mesai-onboarded','mesai-interest','mesai-amb','mesai-checkins','mesai-trial','mesai-bairro','mesai-recent'].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});saved=new Set();sugg=[];interest=[];recent=[];amb={};checkins=[];bairro='Cidade Universitária';posts=[];published=new Set();photosOk={};prof={name:'Visitante'};notif={novos:true,comunidade:true};closeOverlays();places=BASE.slice();resetSearch();renderAll();toast('Dados apagados')}
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
$('onbOffer').onclick=function(){var k='consumidor:'+opSel;if(interest.indexOf(k)<0)interest.push(k);store('mesai-interest',interest);renderPlan();onbClose();updateNotifBadge();setTimeout(function(){pushNotify('Seu teste grátis de 14 dias começou','Mesaí+ liberado até '+trialEndText()+'. Aproveite!','trial')},700)};
$('onbFree').onclick=onbClose;$('onbX').onclick=onbClose;
$('onbSkip').onclick=onbClose;$('onbRestore').addEventListener('click',function(){toast('Ainda não há compras nesta versão.')});
(function(){var x0=null,t=$('onb');t.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});t.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(dx<-50&&onbI<3)onbShow(onbI+1);else if(dx>50&&onbI>0)onbShow(onbI-1)},{passive:true})})();
document.addEventListener('keydown',function(e){if($('onb').hidden)return;if(e.key==='ArrowRight'&&onbI<3)onbShow(onbI+1);if(e.key==='ArrowLeft'&&onbI>0)onbShow(onbI-1)});
function authScreenOpen(){var s=$('authScreen');s.innerHTML='<div class="as-top"><img src="assets/mesai-logo.png" alt="Mesaí"><p>O seu guia para comer no local em Maceió</p></div>'+authHtml()+'<button class="as-skip" id="authSkip" type="button">Agora não, continuar sem conta</button>';s.hidden=false;s.scrollTop=0}
function authScreenClose(){var s=$('authScreen');if(s.hidden)return;s.hidden=true;s.innerHTML='';if(!load('mesai-onboarded',false))onbOpen()}
document.addEventListener('click',function(e){if(e.target.closest('#authSkip'))authScreenClose()});
(function(){var logged=false;try{logged=!!(typeof API!=='undefined'&&API.user())}catch(e){}
if(!load('mesai-onboarded',false)){if(!logged&&typeof MESAI_CONFIG!=='undefined'&&MESAI_CONFIG.supabaseUrl)authScreenOpen();else onbOpen()}})();

var interest=load('mesai-interest',[]);
var trialStart=load('mesai-trial',null);if(!trialStart){trialStart=Date.now();store('mesai-trial',trialStart)}
function trialLeft(){return Math.max(0,14-Math.floor((Date.now()-trialStart)/86400000))}
/* Mesaí+: liberado durante o teste de 14 dias. Assinatura real ainda não existe (mesai-plus fica falso até a cobrança entrar). */
function hasPlus(){return trialLeft()>0||load('mesai-plus',false)===true}
function planWho(c){$('plansC').hidden=!c;$('plansE').hidden=c;$('planC').classList.toggle('on',c);$('planE').classList.toggle('on',!c);$('planC').setAttribute('aria-pressed',c);$('planE').setAttribute('aria-pressed',!c)}
$('planC').onclick=function(){planWho(true)};$('planE').onclick=function(){planWho(false)};
function renderPlan(){var d=trialLeft();if($('rvPlan'))$('rvPlan').textContent=d>0?'Teste · '+d+(d===1?' dia':' dias'):'Teste encerrado';var t=$('trialStatus');if(t)t.textContent=d>0?'Restam '+d+(d===1?' dia':' dias')+' do seu teste (contado neste aparelho).':'Seu teste de 14 dias terminou. Os alertas de lugar novo agora são do Mesaí+; o resto do app segue liberado.'}
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
/* Notificações reais, montadas com o que existe no app (sem exemplos inventados) */
var NOTIFS=[];
function buildNotifs(){
 var read=load('mesai-notif-read',[]),pp=(typeof pubPlaces==='function'?pubPlaces():[]),out=[];
 var d=new Date(),k=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%Math.max(pp.length,1),h=pp[k];
 if(h)out.push({id:'dia-'+d.toISOString().slice(0,10),k:'dia',t:'Lugar do dia: '+h.n,p:h.g+' em '+region(h)+'. Toque para ver endereço e rota.',d:'Hoje',open:h.id});
 if(notif.novos!==false&&hasPlus())newAlerts().forEach(function(a){var x=byId(a.id);if(x&&visible(x)&&inBairro(x))out.push({id:'novo-'+x.id,k:'lugar',t:'Lugar novo em '+bairro,p:x.n+' ('+x.g+') entrou no Mesaí em '+region(x)+'.',d:'Novidades',open:x.id})});
 if(interest.some(function(k){return /^consumidor:/.test(k)}))out.push({id:'trial-start',k:'trial',t:'Seu teste grátis de 14 dias começou',p:'Mesaí+ liberado até '+trialEndText()+'. Salve lugares, ganhe pontos e receba alertas de lugar novo.',d:'Novidades'});
 var pts=points();if(pts>0)out.push({id:'pts-'+pts,k:'pontos',t:'Você tem '+pts+' pontos',p:'Cada check-in em um lugar soma 10 pontos.',d:'Novidades'});
 out.forEach(function(n){n.u=read.indexOf(n.id)<0});
 NOTIFS=out;return out}
function notifsHtml(){buildNotifs();var un=NOTIFS.filter(function(n){return n.u}).length;
 return '<div class="nhead"><span>'+(un?un+' não lidas':'Tudo lido')+'</span>'+(un?'<button class="link" data-notif-read>Marcar todas como lidas</button>':'')+'</div><div class="nlist">'+notifItems()+'</div><h3 class="nday">Preferências</h3>'}
var NLOGO='<img class="nlogo" src="img/logo-app.png" alt="">';
function notifItems(){
 var out='',last='';
 NOTIFS.forEach(function(n){
  if(n.d!==last){out+='<h3 class="nday">'+n.d+'</h3>';last=n.d}
  out+='<'+(n.open?'button data-open="'+esc(n.open)+'"':'div')+' class="nitem k-'+n.k+(n.u?' unread':'')+'"><span class="nico" aria-hidden="true">'+NLOGO+'</span><span class="nbody"><b>'+esc(n.t)+'</b><span class="np">'+esc(n.p)+'</span></span>'+(n.u?'<span class="ndot" aria-label="Não lida"></span>':'')+'</'+(n.open?'button':'div')+'>';
 });
 return out;
}


/* Alertas de lugar novo (Mesaí+): compara os lugares publicados com os que este aparelho já conhecia.
   Primeira vez = só marca o que já existe (sem alerta). Depois, todo lugar publicado que aparecer no bairro vira alerta por 14 dias. */
function newAlerts(){var now=Date.now();return load('mesai-new-alerts',[]).filter(function(a){return a&&a.id&&now-a.at<14*86400000})}
function checkNewPlaces(){
 var seen=load('mesai-seen-places',null),ids=places.filter(visible).map(function(p){return p.id});
 if(!seen){store('mesai-seen-places',ids);return 0}
 var fresh=ids.filter(function(id){return seen.indexOf(id)<0});
 if(!fresh.length)return 0;
 store('mesai-seen-places',seen.concat(fresh));
 var al=newAlerts(),now=Date.now();
 fresh.forEach(function(id){if(!al.some(function(a){return a.id===id}))al.push({id:id,at:now})});
 store('mesai-new-alerts',al.slice(-10));
 var mine=fresh.filter(function(id){var x=byId(id);return x&&inBairro(x)});
 if(mine.length&&notif.novos!==false&&hasPlus()){updateNotifBadge();toast(mine.length===1?'Lugar novo no guia: '+byId(mine[0]).n:mine.length+' lugares novos no guia')}
 return mine.length}
/* Contador de notificações não lidas no sininho */
function updateNotifBadge(){buildNotifs();var n=NOTIFS.filter(function(x){return x.u}).length,b=document.getElementById('nBadge');if(!b)return;b.textContent=n>9?'9+':String(n);b.hidden=!n;b.setAttribute('aria-label',n+' notificações não lidas');var rn=document.getElementById('rvNotif');if(rn){rn.textContent=n?(n>9?'9+':String(n)):'';rn.hidden=!n;rn.setAttribute('aria-label',n+' não lidas')}}
(function(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateNotifBadge);else updateNotifBadge()})();

/* Saudação na home: bom dia / boa tarde / boa noite + nome */
function updateGreet(){var g=document.getElementById('greet');if(!g)return;var hr=parseInt(new Intl.DateTimeFormat('pt-BR',{hour:'numeric',hour12:false,timeZone:'America/Maceio'}).format(new Date()),10)||0,p=(hr<5||hr>=18)?'Boa noite':hr<12?'Bom dia':'Boa tarde';var nm=(S2.on&&API.user()&&S2.name)||'';g.textContent=nm?p+', '+nm.split(' ')[0]+'!':p+'!';g.hidden=!document.body.classList.contains('is-home')}

/* Exemplos que se revezam no campo de busca (param quando a pessoa foca ou digita, e com "reduzir movimento") */
(function(){var ex=['pizza','hambúrguer','pastel','açaí','feijoada','self-service'],i=0,ins=[$('homeInput'),$('searchInput')].filter(Boolean);
 if(!ins.length||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
 setInterval(function(){i=(i+1)%ex.length;ins.forEach(function(el){if(document.activeElement!==el&&!el.value)el.placeholder='Buscar “'+ex[i]+'”'})},3500)})();
/* Se o servidor demorar, mostra o cadastro local em vez de ficar carregando */
if(LOADING)setTimeout(function(){if(LOADING){LOADING=false;renderAll()}},2500);

/* Galeria do detalhe do lugar: carrossel com troca automática e tela cheia ao tocar */
var GAL={t:null,last:0};
function allPhotos(p){var l=(Array.isArray(p.fotos)?p.fotos:[]).filter(Boolean);if(!l.length&&pic(p))l=[pic(p)];return l.slice(0,8)}
function galHtml(p){var l=allPhotos(p);if(!l.length)return photo(p,'dph');var c=COV[p.g]||['#efe9df','#5c564e'];
 return '<div class="gal" style="--c1:'+c[0]+';--c2:'+c[1]+'"><div class="gal-track" data-galtrack>'+l.map(function(u,i){return '<button type="button" class="gal-s" data-galopen="'+i+'" aria-label="Ver foto '+(i+1)+' de '+l.length+' em tela cheia"><img src="'+esc(u)+'" alt="Foto '+(i+1)+' de '+esc(p.n)+'" '+(i?'loading="lazy" ':'')+'referrerpolicy="no-referrer" onerror="var b=this.parentNode;b.remove()"></button>'}).join('')+'</div>'+(l.length>1?'<div class="gal-dots" aria-hidden="true">'+l.map(function(u,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('')+'</div>':'')+'</div>'}
function galStart(){clearInterval(GAL.t);var t=document.querySelector('[data-galtrack]');if(!t||t.children.length<2)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 GAL.t=setInterval(function(){var t=document.querySelector('[data-galtrack]');if(!t||!t.offsetParent||document.querySelector('.lb')){if(!t)clearInterval(GAL.t);return}
  if(Date.now()-GAL.last<7000)return;var w=t.clientWidth,i=Math.round(t.scrollLeft/w),n=t.children.length;t.scrollTo({left:((i+1)%n)*w,behavior:'smooth'})},3500)}
function galDots(t){var i=Math.round(t.scrollLeft/Math.max(1,t.clientWidth)),d=t.parentNode.querySelectorAll('.gal-dots i');d.forEach(function(x,k){x.classList.toggle('on',k===i)})}
function lbOpen(srcs,i){var o=document.createElement('div');o.className='lb';o.setAttribute('role','dialog');o.setAttribute('aria-label','Fotos do lugar');
 o.innerHTML='<button type="button" class="lb-x" data-lbx aria-label="Fechar fotos"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lb-track">'+srcs.map(function(u){return '<div class="lb-s"><img src="'+esc(u)+'" alt="" referrerpolicy="no-referrer"></div>'}).join('')+'</div><div class="lb-n"></div>';
 document.body.appendChild(o);var t=o.querySelector('.lb-track'),n=o.querySelector('.lb-n');
 function upd(){n.textContent=srcs.length>1?(Math.round(t.scrollLeft/Math.max(1,t.clientWidth))+1)+' / '+srcs.length:''}
 t.addEventListener('scroll',upd);t.scrollLeft=i*t.clientWidth;upd();
 o.addEventListener('click',function(e){if(e.target.closest('[data-lbx]')||e.target.classList.contains('lb-s')||e.target===t)lbClose()})}
function lbClose(){var o=document.querySelector('.lb');if(o)o.remove()}
document.addEventListener('keydown',function(e){if(e.key==='Escape')lbClose()});
document.addEventListener('scroll',function(e){var t=e.target;if(t&&t.matches&&t.matches('[data-galtrack]')){galDots(t);GAL.last=Date.now()}},true);
document.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('[data-galtrack]'))GAL.last=Date.now()},true);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-galopen]');if(!b)return;var t=b.parentNode;var s=[].map.call(t.querySelectorAll('img'),function(x){return x.getAttribute('src')});lbOpen(s,[].indexOf.call(t.children,b))});
try{new MutationObserver(function(){galStart()}).observe(document.getElementById('detail'),{childList:true})}catch(e){}

/* Notificação dentro do app (aparece no topo, como um push) */
function trialEndText(){var d=new Date(trialStart+14*86400000);return d.getDate()+'/'+('0'+(d.getMonth()+1)).slice(-2)}
var PN={t:null};
function pushNotify(title,body,kind){var old=document.querySelector('.pushn');if(old)old.remove();clearTimeout(PN.t);
 var n=document.createElement('button');n.type='button';n.className='pushn';n.setAttribute('role','status');
 n.innerHTML='<span class="pn-ico"><img src="img/logo-app.png" alt=""></span><span class="pn-b"><span class="pn-h"><b>Mesaí</b><small>agora</small></span><strong>'+esc(title)+'</strong><span class="pn-t">'+esc(body)+'</span></span>';
 document.body.appendChild(n);requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.add('in')})});
 function bye(){n.classList.remove('in');setTimeout(function(){n.remove()},350)}
 n.addEventListener('click',function(){bye();try{store('mesai-notif-read',(load('mesai-notif-read',[])).concat([kind==='trial'?'trial-start':kind]));}catch(e){}openSheet('notif');updateNotifBadge()});
 var y0=null;n.addEventListener('touchstart',function(e){y0=e.touches[0].clientY},{passive:true});n.addEventListener('touchmove',function(e){if(y0!==null&&e.touches[0].clientY-y0<-24){y0=null;bye()}},{passive:true});
 PN.t=setTimeout(bye,6000)}

/* Ícones automáticos nos botões (consistência visual em todas as telas) */
(function(){
 var MAP=[[/^(Baixar)/,'download'],[/^Enviar sugest/,'send'],[/^(Sugerir)/,'plus'],[/^(Publicar|Confirmei)/,'check'],[/Tenho interesse|Guardar meu interesse|Surpreenda/,'spark'],[/^(Ver todos|Ver detalhes|Ver \d|Nenhum lugar)/,'search'],[/^Abrir no Google Maps/,'pin'],[/^(Entrar|Ir para o login)/,'login'],[/^Sair/,'logout'],[/^(Salvar nova senha|Salvar)$/,'check'],[/^(Excluir|Apagar|Remover|Em uso)/,'trash'],[/^(Rever a introdu|Limpar filtros)/,'refresh'],[/^Usar como capa/,'image']];
 function deco(root){
  var bs=(root||document).querySelectorAll('.btn:not(.act):not(.go):not([data-ico])');
  for(var i=0;i<bs.length;i++){var b=bs[i];b.setAttribute('data-ico','1');
   if(b.querySelector('.i'))continue;
   var t=(b.textContent||'').trim(),n=null;
   for(var k=0;k<MAP.length;k++){if(MAP[k][0].test(t)){n=MAP[k][1];break}}
   if(n)b.insertAdjacentHTML('afterbegin',ico(n))}}
 var busy=false;
 function run(){if(busy)return;busy=true;try{deco(document)}finally{busy=false}}
 function start(){run();try{new MutationObserver(function(){run()}).observe(document.body,{childList:true,subtree:true})}catch(e){}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
