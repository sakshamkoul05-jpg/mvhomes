/* MV Homes — shared behaviour + one module per page (body[data-page]). */
(function(){
var D=window.MV, $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var PAGE=document.body.getAttribute('data-page');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGsap=!!(window.gsap&&window.ScrollTrigger);
var animate=hasGsap&&!reduce;
if(animate){document.documentElement.classList.add('anim');gsap.registerPlugin(ScrollTrigger);if(window.Flip)gsap.registerPlugin(Flip)}
var mob=function(){return window.innerWidth<720};
var ICON={
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tick:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>'
};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function img(src,alt,cls){return '<div class="img'+(cls?' '+cls:'')+'"><img src="'+src+'" alt="'+esc(alt||'')+'" loading="lazy" decoding="async"></div>'}
function waURL(text){return 'https://wa.me/'+D.WA+(text?'?text='+encodeURIComponent(text):'')}

/* ---------- image fallback (keeps layout if a photo fails) ---------- */
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.parentNode&&t.parentNode.classList&&t.parentNode.classList.contains('img'))t.parentNode.classList.add('noimg')},true);
$$('.img img').forEach(function(i){if(i.complete&&i.naturalWidth===0&&i.src)i.parentNode.classList.add('noimg')});

/* ---------- header: tabs + menu ---------- */
(function(){
  var tabs=$('#tabs'),menu=$('#menuList');
  if(tabs)tabs.innerHTML=D.PAGES.map(function(p){return '<a href="'+p.href+'"'+(p.k===PAGE?' aria-current="page"':'')+'>'+p.name+'</a>'}).join('');
  if(menu)menu.innerHTML=D.PAGES.map(function(p,i){return '<li><a href="'+p.href+'"'+(p.k===PAGE?' aria-current="page"':'')+'><span class="d">'+(i===0?'R':(i<10?'0'+i:i))+'</span><span class="t">'+p.name+'<span class="s">'+p.sub+'</span></span><span class="s">›</span></a></li>'}).join('');
  var m=$('#menu');
  function open(){m.hidden=false;$('#menuBtn').setAttribute('aria-expanded','true');if(lenis)lenis.stop();if(animate)gsap.from('#menu li',{y:24,opacity:0,stagger:.04,duration:.55,ease:'power3.out'});$('#menuClose').focus()}
  function close(){if(m.hidden)return;m.hidden=true;$('#menuBtn').setAttribute('aria-expanded','false');if(lenis)lenis.start()}
  $('#menuBtn').addEventListener('click',open);$('#menuClose').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){close();closeEnquiry();window.closeLightbox&&window.closeLightbox()}});
  window.__closeMenu=close;
})();

/* ---------- smooth scroll ---------- */
var lenis=null;
if(animate&&window.Lenis){try{lenis=new Lenis({lerp:.09});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}catch(_){lenis=null}}
function scrollToY(y,immediate){if(lenis)lenis.scrollTo(y,{immediate:!!immediate,force:true,duration:1.2});else window.scrollTo({top:y,behavior:immediate||reduce?'auto':'smooth'})}

/* ---------- header colour / hide on scroll ---------- */
var hdr=$('#hdr'),lastY=0,darkUntil=function(){var el=$('[data-dark-top]');return el?el.getBoundingClientRect().bottom+scrollY-70:0};
var extraDark=null;
function hdrState(){
  var y=scrollY,dark=y<darkUntil();
  if(extraDark&&extraDark(y))dark=true;
  var foot=$('footer.stilt');if(foot&&foot.getBoundingClientRect().top<60)dark=true;
  hdr.classList.toggle('solid',!dark);
  hdr.classList.toggle('hide',y>400&&y>lastY+2&&!document.body.classList.contains('no-hide'));
  if(y<lastY-2||y<400)hdr.classList.remove('hide');
  lastY=y;
}
window.addEventListener('scroll',hdrState,{passive:true});

/* ---------- lift-door page transitions ---------- */
var doors=$('#doors');
function pageName(href){var f=href.split('/').pop().split('#')[0]||'index.html';var p=D.PAGES.filter(function(x){return x.href===f})[0];return p?p:null}
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;
  var href=a.getAttribute('href');if(!/\.html(#.*)?$/.test(href)||/^https?:/.test(href))return;
  var p=pageName(href);if(!p)return;
  if(p.k===PAGE&&href.indexOf('#')<0){e.preventDefault();window.__closeMenu();scrollToY(0);return}
  if(reduce||!doors)return;
  e.preventDefault();window.__closeMenu();
  $('#dDigit').textContent=String(D.PAGES.indexOf(p)===0?'R':D.PAGES.indexOf(p));
  $('#dName').textContent=p.name;$('#dArr').textContent='▼';
  doors.classList.add('shut');
  setTimeout(function(){location.href=href},880);
});
window.addEventListener('pageshow',function(e){if(e.persisted&&doors)doors.classList.remove('shut')});

/* ---------- WhatsApp float ---------- */
(function(){
  var f=$('#waFloat');if(!f)return;
  var msg='Hello MV Homes, I found you on your website. I am looking for a property in South Delhi.';
  f.innerHTML='<div class="wa-bubble" id="waBubble" role="status"><button type="button" aria-label="Dismiss">×</button><b>MV Homes · usually replies fast</b>Looking for a home in South Delhi? Message us on WhatsApp.</div><a class="wa-btn" href="'+waURL(msg)+'" target="_blank" rel="noopener" aria-label="Chat with MV Homes on WhatsApp">'+ICON.wa+'<span>Chat on WhatsApp</span></a>';
  var b=$('#waBubble'),seen=false;try{seen=sessionStorage.getItem('mvwa')==='1'}catch(_){}
  if(!seen)setTimeout(function(){b.classList.add('show');setTimeout(function(){b.classList.remove('show')},9000)},7000);
  b.querySelector('button').addEventListener('click',function(){b.classList.remove('show');try{sessionStorage.setItem('mvwa','1')}catch(_){}});
})();

/* ---------- forms (enquiry modal + inline forms) ---------- */
var LOCOPTS=D.LOCS.map(function(l){return '<option>'+l.name+'</option>'}).join('');
function formHTML(id,kind){
  var purpose=kind==='sell'?'<option>Sell my property</option><option>Rent out my property</option>':'<option>Buy a property</option><option>Rent a property</option><option>Sell my property</option><option>Rent out my property</option>';
  return '<form class="form js-form" id="'+id+'" data-kind="'+kind+'" novalidate>'+
  '<div class="row2"><div class="field"><label for="'+id+'-name">Name</label><input id="'+id+'-name" name="name" autocomplete="name" placeholder="Your name"></div>'+
  '<div class="field"><label for="'+id+'-phone">Mobile</label><input id="'+id+'-phone" name="phone" inputmode="tel" autocomplete="tel" placeholder="10-digit mobile"></div></div>'+
  '<div class="row2"><div class="field"><label for="'+id+'-purpose">I want to</label><select id="'+id+'-purpose" name="purpose">'+purpose+'</select></div>'+
  '<div class="field"><label for="'+id+'-loc">Colony</label><select id="'+id+'-loc" name="locality"><option value="">Any / not sure</option>'+LOCOPTS+'</select></div></div>'+
  (kind==='sell'?'<div class="row2"><div class="field"><label for="'+id+'-plot">Plot size</label><input id="'+id+'-plot" name="plot" placeholder="e.g. 200 sq. yd."></div><div class="field"><label for="'+id+'-floor">Floor</label><select id="'+id+'-floor" name="floor"><option>Ground</option><option>First</option><option>Second</option><option>Third</option><option>Entire building / plot</option></select></div></div>':
  '<div class="row2"><div class="field"><label for="'+id+'-budget">Budget</label><input id="'+id+'-budget" name="budget" placeholder="₹2.5 Cr or ₹60,000/month"></div><div class="field"><label for="'+id+'-email">Email (optional)</label><input id="'+id+'-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div></div>')+
  '<div class="field"><label for="'+id+'-msg">Message</label><textarea id="'+id+'-msg" name="message" placeholder="'+(kind==='sell'?'Expected price, building age, lift, parking':'BHK, floor, parking, move-in date')+'"></textarea></div>'+
  '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">'+
  '<p class="err" hidden></p>'+
  '<div class="form-actions"><button class="btn" type="submit">Send enquiry</button><a class="btn wa js-wa" href="'+waURL()+'" target="_blank" rel="noopener">'+ICON.wa.replace('<svg','<svg width="18" height="18"')+'WhatsApp instead</a></div>'+
  '<p class="note">We reply within working hours, 9 am to 9 pm, every day.</p></form>';
}
function formData(f){var o={};$$('input,select,textarea',f).forEach(function(el){if(el.name)o[el.name]=el.value.trim()});return o}
function waText(o){var t='Hello MV Homes,\nName: '+(o.name||'-')+'\nMobile: '+(o.phone||'-')+'\nI want to: '+(o.purpose||'-');if(o.locality)t+='\nColony: '+o.locality;if(o.budget)t+='\nBudget: '+o.budget;if(o.plot)t+='\nPlot: '+o.plot;if(o.floor)t+='\nFloor: '+o.floor;if(o.message)t+='\n'+o.message;return t}
function wireForm(f){
  var sync=function(){$('.js-wa',f).href=waURL(waText(formData(f)))};
  f.addEventListener('input',sync);f.addEventListener('change',sync);sync();
  f.addEventListener('submit',function(e){
    e.preventDefault();var o=formData(f),er=$('.err',f);
    if(o._honey)return;
    if(!o.name||(o.phone||'').replace(/\D/g,'').length<10){er.textContent='Add your name and a 10-digit mobile number so we can call you back.';er.hidden=false;return}
    er.hidden=true;var btn=$('button[type=submit]',f);btn.disabled=true;btn.textContent='Sending…';
    var payload={name:o.name,phone:o.phone,purpose:o.purpose,locality:o.locality||'-',budget:o.budget||'-',plot:o.plot||'-',floor:o.floor||'-',email:o.email||'-',message:o.message||'-',page:document.title,_subject:'New enquiry from MV Homes website: '+o.purpose,_template:'table',_captcha:'false'};
    var done=function(ok){
      f.innerHTML='<div class="sent"><div class="tick">'+ICON.tick+'</div><h3 class="h-md" style="font-size:1.5rem">'+(ok?'Thank you, '+esc(o.name.split(' ')[0])+'.':'Almost there.')+'</h3><p style="color:var(--muted)">'+(ok?'Your enquiry has reached our office. We will call you on '+esc(o.phone)+' shortly.':'We could not send this by email right now. Tap below to send the same details on WhatsApp.')+'</p><div class="form-actions"><a class="btn wa" href="'+waURL(waText(o))+'" target="_blank" rel="noopener">'+ICON.wa.replace('<svg','<svg width="18" height="18"')+(ok?'Also message on WhatsApp':'Send on WhatsApp')+'</a></div></div>';
    };
    fetch('https://formsubmit.co/ajax/'+D.EMAIL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){return r.json()}).then(function(j){done(j&&String(j.success)==='true')}).catch(function(){done(false)});
  });
}
/* modal */
var enq=$('#enquiry');
$('#enqBody').innerHTML=formHTML('mform','general');
wireForm($('#mform'));
function openEnquiry(ctx){
  if(ctx){var f=$('#mform');if(f&&f.querySelector('[name=message]')){f.querySelector('[name=message]').value=ctx.msg||'';if(ctx.purpose)f.querySelector('[name=purpose]').value=ctx.purpose;if(ctx.loc)f.querySelector('[name=locality]').value=ctx.loc;f.dispatchEvent(new Event('input'))}}
  enq.hidden=false;requestAnimationFrame(function(){enq.classList.add('open')});if(lenis)lenis.stop();
  setTimeout(function(){var n=$('#mform [name=name]');n&&n.focus()},300);
}
function closeEnquiry(){if(!enq||enq.hidden)return;enq.classList.remove('open');setTimeout(function(){enq.hidden=true},380);if(lenis)lenis.start()}
$('#enqClose').addEventListener('click',closeEnquiry);$('#enquiry .scrim').addEventListener('click',closeEnquiry);
function listingCtx(x){return {msg:'Interested in: '+x.title+(x.loc?', '+x.loc:'')+' ('+x.plot+', '+x.floor+' floor, '+x.price+(x.per||'')+').',purpose:x.p==='rent'?'Rent a property':'Buy a property',loc:x.loc}}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-enquire]');if(!b)return;e.preventDefault();
  var v=b.getAttribute('data-enquire'),ctx=null;
  if(v==='feat')ctx=listingCtx(D.FEATURED);
  else if(/^\d+$/.test(v)){var x=D.LISTINGS.filter(function(l){return String(l.id)===v})[0];if(x)ctx=listingCtx(x)}
  else if(v)ctx={msg:'',purpose:v};
  openEnquiry(ctx);
});
$$('[data-form]').forEach(function(c,i){c.innerHTML=formHTML('f'+i,c.getAttribute('data-form'));wireForm($('form',c))});

/* copy buttons */
document.addEventListener('click',function(e){var b=e.target.closest('.copy');if(!b)return;var v=b.dataset.copy,done=function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1500)},fb=function(){var r=document.createRange();r.selectNodeContents(b.previousElementSibling);var s=getSelection();s.removeAllRanges();s.addRange(r)};try{navigator.clipboard.writeText(v).then(done,fb)}catch(_){fb()}});
$$('.yr').forEach(function(y){y.textContent=new Date().getFullYear()});

/* ---------- shared listing card ---------- */
var PLANS={
 2:[[0,0,55,48,'Bed'],[0,48,55,52,'Bed'],[55,0,65,62,'Living'],[55,62,35,38,'Kitchen'],[90,62,30,20,'WC'],[90,82,30,18,'WC'],[120,0,40,30,'Balcony'],[120,30,40,70,'Lobby']],
 3:[[0,0,50,45,'Bed'],[0,45,50,55,'Bed'],[50,0,62,55,'Living'],[50,55,38,45,'Dining'],[88,55,24,45,'Kit.'],[112,0,48,52,'Bed'],[112,52,24,24,'WC'],[136,52,24,24,'WC'],[112,76,48,24,'Lift']],
 4:[[0,0,44,40,'Bed'],[0,40,44,38,'Bed'],[0,78,22,22,'WC'],[22,78,22,22,'Puja'],[44,0,62,50,'Living'],[44,50,40,50,'Dining'],[84,50,22,50,'Kit.'],[106,0,54,36,'Bed'],[106,36,54,34,'Bed'],[106,70,26,30,'WC'],[132,70,28,30,'Lift']]
};
function planSVG(b){
  var s='<svg viewBox="-14 -12 188 124" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
  PLANS[b].forEach(function(r){var fill=r[4]==='Bed'?'#E1E7F1':(r[4]==='Living'||r[4]==='Dining'?'#FFFFFF':'#EEF1F6');
    s+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" fill="'+fill+'"/><path class="w" pathLength="1" stroke-width=".9" d="M'+r[0]+' '+r[1]+'h'+r[2]+'v'+r[3]+'h-'+r[2]+'z"/><text x="'+(r[0]+r[2]/2)+'" y="'+(r[1]+r[3]/2+1.5)+'" text-anchor="middle" font-family="Hanken Grotesk,Arial,sans-serif" font-size="4.2" fill="#5B6880">'+r[4]+'</text>'});
  return s+'<path class="w" pathLength="1" stroke-width="2.6" d="M0 0h160v100h-160z"/></svg>';
}
var FLN={Ground:'G',First:'1',Second:'2',Third:'3'};
function cardHTML(x){
  return '<article class="card" data-id="'+x.id+'"><div class="media"><div class="flip"><div class="face front">'+img(x.img,x.title)+'</div><div class="face back">'+planSVG(x.bhk)+'</div></div>'+
  '<span class="tg'+(x.p==='rent'?' rent':'')+'">'+(x.p==='rent'?'For rent':'For sale')+'</span><span class="fl-badge" title="'+x.floor+' floor">'+FLN[x.floor]+'</span>'+
  '<div class="viewtoggle" role="group" aria-label="View"><button type="button" data-v="photo" aria-pressed="true">Photo</button><button type="button" data-v="plan" aria-pressed="false">Plan</button></div></div>'+
  '<div class="bd"><div class="loc"><span>'+x.loc+'</span><span>'+x.facing+' facing</span></div><h3>'+x.title+'</h3>'+
  '<dl class="specs"><div><dt>Plot</dt><dd class="num">'+x.plot+'</dd></div><div><dt>Floor</dt><dd>'+x.floor+'</dd></div><div><dt>Config</dt><dd>'+x.bhk+' BHK</dd></div></dl>'+
  '<div class="ft"><span class="price num">'+x.price+(x.per?' <small>'+x.per+'</small>':'')+'</span><span class="acts"><a class="icon-btn wa" href="'+waURL('Hello MV Homes, I am interested in: '+x.title+', '+x.loc+' ('+x.price+(x.per||'')+').')+'" target="_blank" rel="noopener" aria-label="Ask on WhatsApp">'+ICON.wa+'</a><button class="btn" style="padding:10px 16px" data-enquire="'+x.id+'">Enquire</button></span></div></div></article>';
}
document.addEventListener('click',function(e){var b=e.target.closest('.viewtoggle button');if(!b)return;var c=b.closest('.card');c.classList.toggle('show-plan',b.dataset.v==='plan');$$('.viewtoggle button',c).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})});

/* ---------- shared reveals ---------- */
function reveals(){
  if(!animate)return;
  $$('.rv').forEach(function(el){gsap.from(el,{y:36,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}})});
  $$('.plate .rule').forEach(function(r){gsap.from(r,{scaleX:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:r,start:'top 90%'}})});
  $$('.fnum').forEach(function(n){gsap.fromTo(n,{yPercent:-20},{yPercent:30,ease:'none',scrollTrigger:{trigger:n.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});
  $$('.phero .ph-img img').forEach(function(i){gsap.to(i,{yPercent:12,scale:1.06,ease:'none',scrollTrigger:{trigger:i.closest('.phero'),start:'top top',end:'bottom top',scrub:true}})});
  var h=$$('.phero h1 .ln>span');if(h.length)gsap.from(h,{yPercent:110,duration:1.1,ease:'power4.out',stagger:.08,delay:.9});
  var sub=$$('.phero .sub, .phero .eyebrow, .phero .ctas');if(sub.length)gsap.from(sub,{y:20,opacity:0,duration:.9,stagger:.07,ease:'power3.out',delay:1.15});
}

/* ============ PAGE MODULES ============ */
var M={};

/* facade used on home */
function facade(){
  var N='#C7D2E6',s='',x0=40,w=300,base=540,stilt=70,fh=100,fill='#0A1D40';
  s+='<line x1="-400" y1="'+base+'" x2="800" y2="'+base+'" stroke="'+N+'" stroke-opacity=".35" stroke-width="1.5"/>';
  for(var i=0;i<4;i++)s+='<rect x="'+(x0+i*96)+'" y="'+(base-stilt)+'" width="12" height="'+stilt+'" fill="'+N+'" fill-opacity=".85"/>';
  for(var c=0;c<2;c++){var cx=x0+28+c*96;s+='<path d="M'+cx+' '+(base-8)+'h48v-8c0-3-2-4-5-5l-6-1-6-5h-16l-7 5-6 1c-2 1-2 2-2 4z" fill="none" stroke="'+N+'" stroke-width="1.2"/>'}
  for(var f=0;f<4;f++){var y=base-stilt-(f+1)*fh;
    s+='<rect x="'+x0+'" y="'+y+'" width="'+w+'" height="'+fh+'" fill="'+fill+'" stroke="'+N+'" stroke-width="2"/>';
    s+='<rect class="win" data-f="'+f+'" x="'+(x0+20)+'" y="'+(y+18)+'" width="110" height="56"/><line x1="'+(x0+75)+'" y1="'+(y+18)+'" x2="'+(x0+75)+'" y2="'+(y+74)+'" stroke="'+N+'"/><rect x="'+(x0+20)+'" y="'+(y+18)+'" width="110" height="56" fill="none" stroke="'+N+'" stroke-width="1.3"/>';
    s+='<rect class="win" data-f="'+f+'" x="'+(x0+150)+'" y="'+(y+18)+'" width="56" height="56"/><rect x="'+(x0+150)+'" y="'+(y+18)+'" width="56" height="56" fill="none" stroke="'+N+'" stroke-width="1.3"/>';
    s+='<rect class="win" data-f="'+f+'" x="'+(x0+222)+'" y="'+(y+12)+'" width="62" height="70"/><rect x="'+(x0+222)+'" y="'+(y+12)+'" width="62" height="70" fill="none" stroke="'+N+'" stroke-width="1.3"/>';
    s+='<rect x="'+(x0+10)+'" y="'+(y+fh-20)+'" width="130" height="20" fill="'+fill+'" stroke="'+N+'" stroke-width="1.4"/>';
    for(var k=1;k<16;k++)s+='<line x1="'+(x0+10+k*8.1)+'" y1="'+(y+fh-20)+'" x2="'+(x0+10+k*8.1)+'" y2="'+(y+fh)+'" stroke="'+N+'" stroke-width=".7"/>';
  }
  var top=base-stilt-4*fh;
  s+='<rect x="'+(x0-6)+'" y="'+(top-10)+'" width="'+(w+12)+'" height="10" fill="'+N+'"/><rect x="'+(x0+214)+'" y="'+(top-56)+'" width="80" height="46" fill="'+fill+'" stroke="'+N+'" stroke-width="2"/><rect class="win" x="'+(x0+236)+'" y="'+(top-42)+'" width="22" height="32"/><rect x="'+(x0+236)+'" y="'+(top-42)+'" width="22" height="32" fill="none" stroke="'+N+'" stroke-width="1.2"/>';
  s+='<rect x="'+(x0+w+14)+'" y="'+(top-56)+'" width="2.5" height="'+(base-top+56)+'" fill="#B98A2E"/>';
  return s;
}
function featuredPlan(){
  var P=function(x,y,w,h){return 'M'+x+' '+y+'H'+(x+w)+'V'+(y+h)+'H'+x+'Z'};
  var rooms=[['Master bedroom',"16' × 14'6\"",20,20,200,180],['Bedroom 2',"16' × 14'6\"",20,200,200,180],['Living',"18' × 17'",220,20,220,210],['Dining',"13' × 12'",220,230,160,150],['Kitchen',"8' × 12'",380,230,100,150],['Bedroom 3',"11' × 13'",440,20,140,160],['Toilet','',440,180,70,80],['Toilet','',510,180,70,80],['Lift · stair','',480,260,100,120]];
  var s='<g class="walls"><path class="wall ow" pathLength="1" d="'+P(20,20,560,360)+'"/>';
  rooms.forEach(function(r){s+='<path class="wall iw" pathLength="1" d="'+P(r[2],r[3],r[4],r[5])+'"/>'});
  s+='</g><g class="furnish"><line class="gap" x1="180" y1="200" x2="210" y2="200"/><path class="door" d="M180 200 v-30 a30 30 0 0 1 30 30"/><line class="gap" x1="240" y1="230" x2="270" y2="230"/><path class="door" d="M240 230 v-30 a30 30 0 0 1 30 30"/><line class="gap" x1="220" y1="120" x2="220" y2="150"/><path class="door" d="M220 120 h-30 a30 30 0 0 0 30 30"/><line class="gap" x1="440" y1="100" x2="440" y2="128"/><path class="door" d="M440 100 h-28 a28 28 0 0 0 28 28"/>';
  s+='<path class="furn" d="'+P(60,50,90,110)+P(64,54,38,22)+P(108,54,38,22)+'"/><path class="furn" d="'+P(60,240,80,105)+P(64,244,72,22)+'"/><path class="furn" d="'+P(470,60,80,90)+P(474,64,72,20)+'"/><path class="furn" d="M250 60 h40 v110 h-40z M290 60 h110 v32 h-110z"/><path class="furn" d="'+P(320,120,70,50)+'"/><circle class="furn" cx="300" cy="305" r="34"/>';
  [[300,262],[300,348],[257,305],[343,305]].forEach(function(c){s+='<circle class="furn" cx="'+c[0]+'" cy="'+c[1]+'" r="7"/>'});
  s+='<path class="furn" d="M390 240 h80 v24 h-56 v104 h-24z"/><path class="furn" d="M500 280 h60 v80 h-60z M500 280 l60 80 M560 280 l-60 80"/></g><g class="labels">';
  rooms.forEach(function(r){var cx=r[2]+r[4]/2,cy=r[3]+r[5]/2;if(/Bed|Kitchen/.test(r[0]))cy=r[3]+r[5]-26;if(r[0]==='Living')cy=r[3]+r[5]-34;if(r[0]==='Dining')cy=r[3]+20;if(r[0]==='Lift · stair')cy=r[3]+18;
    s+='<text class="rl" x="'+cx+'" y="'+cy+'" text-anchor="middle">'+r[0]+'</text>'+(r[1]?'<text class="rd" x="'+cx+'" y="'+(cy+14)+'" text-anchor="middle">'+r[1]+'</text>':'')});
  s+='<line class="dim" x1="20" y1="-14" x2="580" y2="-14"/><line class="dim" x1="20" y1="-20" x2="20" y2="-8"/><line class="dim" x1="580" y1="-20" x2="580" y2="-8"/><rect x="262" y="-23" width="76" height="16" fill="#F6F7FA"/><text class="dimt" x="300" y="-11" text-anchor="middle">45 FT</text><text class="dimt" x="20" y="-28">PARK SIDE · EAST ↑</text><line class="dim" x1="600" y1="20" x2="600" y2="380"/><line class="dim" x1="594" y1="20" x2="606" y2="20"/><line class="dim" x1="594" y1="380" x2="606" y2="380"/><text class="dimt" x="612" y="204" transform="rotate(90 612 204)" text-anchor="middle">40 FT</text></g>';
  return s;
}

M.home=function(){
  $('#heroFacade').innerHTML=facade();$('#enterFacade').innerHTML=facade();$('#featPlan').innerHTML=featuredPlan();
  $$('#enterFacade .win').forEach(function(w){if(Math.random()<.55||w.getAttribute('data-f')==='3')w.classList.add('on')});
  var wins=$$('#heroFacade .win'),skip=[2,7];
  setTimeout(function(){wins.forEach(function(w,i){if(skip.indexOf(i)>-1)return;setTimeout(function(){w.classList.add('on')},reduce?0:i*110+Math.random()*160)})},reduce?0:1500);
  $('#homeCards').innerHTML=D.LISTINGS.filter(function(x){return x.p==='sale'}).slice(0,3).map(cardHTML).join('');

  var enterST=null;
  if(animate){
    var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#f3 .pin',start:'top top',end:mob()?'+=220%':'+=300%',pin:true,scrub:.7,anticipatePin:1}});
    enterST=tl.scrollTrigger;
    var walls=$$('#featPlan .wall');gsap.set(walls,{strokeDasharray:1,strokeDashoffset:1});gsap.set('#featPlan .furnish, #featPlan .labels',{opacity:0});gsap.set('#f3 .panel',{x:40,opacity:0});
    tl.from('#f3 .cap',{y:30,opacity:0,duration:.08}).to('#enterFacade',{scale:18,svgOrigin:'115 116',duration:.5,ease:'power2.in'},.1).to('#f3 .cap',{opacity:0,y:-30,duration:.12},.2)
      .to('#f3 .flood',{opacity:1,duration:.1},.48).to('#f3 .flood',{backgroundColor:'#F6F7FA',duration:.08},.58).to('#f3 .home',{opacity:1,duration:.04},.64)
      .to(walls,{strokeDashoffset:0,duration:.16,stagger:.012},.66).to('#featPlan .furnish',{opacity:1,duration:.06},.86).to('#featPlan .labels',{opacity:1,duration:.06},.88).to('#f3 .panel',{x:0,opacity:1,duration:.08},.88).to({},{duration:.06});
    extraDark=function(y){return y>=enterST.start-80&&y<enterST.start+(enterST.end-enterST.start)*.6};
    gsap.from('.roof h1 .ln>span',{yPercent:110,duration:1.1,ease:'power4.out',stagger:.09,delay:1.05});
    gsap.from('.roof .lede, .roof .ctas, .roof .eyebrow',{y:24,opacity:0,duration:.9,ease:'power3.out',stagger:.08,delay:1.35});
    gsap.from('#heroFacade',{y:60,duration:1.4,ease:'power3.out',delay:1});
    gsap.to('.roof .bldg',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.roof',start:'top top',end:'bottom top',scrub:true}});
    /* category tiles: little lift doors open as they come into view */
    $$('.cat').forEach(function(c,i){ScrollTrigger.create({trigger:c,start:'top 85%',once:true,onEnter:function(){setTimeout(function(){c.classList.add('opened')},i*120)}})});
    $$('#homeCards .card').forEach(function(c,i){gsap.from(c,{y:50,opacity:0,duration:.9,delay:i*.08,ease:'power3.out',scrollTrigger:{trigger:'#homeCards',start:'top 85%'}})});
  } else $$('.cat').forEach(function(c){c.classList.add('opened')});

  /* lift panel */
  var FL=[{k:'R',id:'roof',name:'Roof'},{k:'3',id:'f3',name:'Featured home'},{k:'2',id:'f2',name:'Homes for sale'},{k:'1',id:'f1',name:'What we do'},{k:'G',id:'fg',name:'Lobby'},{k:'S',id:'fs',name:'Stilt'}],ORDER=FL.map(function(f){return f.k}),cur='R',ly=0,idle;
  $('#fls').innerHTML=FL.map(function(f){return '<button class="fl" data-lift="'+f.k+'" aria-label="'+f.name+'">'+f.k+'<span class="tip">'+f.name+'</span></button>'}).join('');
  function setFloor(k){cur=k;$$('.lift .fl').forEach(function(b){b.classList.toggle('on',b.dataset.lift===k)});$('#lDigit').textContent=k;$('#tDigit').textContent=k}
  window.addEventListener('scroll',function(){var y=scrollY,a=y>ly?'▼':(y<ly?'▲':' ');ly=y;$('#lArr').textContent=a;$('#tArr').textContent=a;clearTimeout(idle);idle=setTimeout(function(){$('#lArr').textContent=' ';$('#tArr').textContent=' '},500)},{passive:true});
  if(hasGsap)FL.forEach(function(f){ScrollTrigger.create({trigger:'#'+f.id,start:'top 50%',end:'bottom 50%',onToggle:function(s){if(s.isActive)setFloor(f.k)}})});
  setFloor('R');
  function floorY(k){if(k==='3'&&enterST)return enterST.end;var f=FL.filter(function(x){return x.k===k})[0];return Math.max(0,document.getElementById(f.id).getBoundingClientRect().top+scrollY-(k==='R'?0:10))}
  var actx=null;function ding(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();var t=actx.currentTime;[[1318,0],[1046,.16]].forEach(function(n){var o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.value=n[0];g.gain.setValueAtTime(0,t+n[1]);g.gain.linearRampToValueAtTime(.045,t+n[1]+.01);g.gain.exponentialRampToValueAtTime(.0001,t+n[1]+.9);o.connect(g);g.connect(actx.destination);o.start(t+n[1]);o.stop(t+n[1]+1)})}catch(_){}}
  var busy=false;
  function travel(k){
    $('#lift').classList.remove('open');$('#liftToggle').setAttribute('aria-expanded','false');
    if(!animate){scrollToY(floorY(k),true);setFloor(k);return}
    if(busy)return;busy=true;var from=ORDER.indexOf(cur),to=ORDER.indexOf(k),step=to>from?1:-1,i=from;
    $('#dArr').textContent=to===from?'•':(step>0?'▼':'▲');$('#dDigit').textContent=cur;$('#dName').textContent=FL[to].name;doors.classList.add('shut');
    setTimeout(function(){var t=setInterval(function(){if(i===to){clearInterval(t);scrollToY(floorY(k),true);setFloor(k);ScrollTrigger.update();setTimeout(function(){ding();doors.classList.remove('shut');busy=false},260);return}i+=step;$('#dDigit').textContent=ORDER[i]},230)},820);
  }
  document.addEventListener('click',function(e){var g=e.target.closest('[data-lift]');if(!g)return;e.preventDefault();travel(g.dataset.lift)});
  $('#liftToggle').addEventListener('click',function(){var o=$('#lift').classList.toggle('open');this.setAttribute('aria-expanded',String(o))});
};

M.about=function(){
  /* building rises slab by slab as you read the story */
  var svg=$('#crane');if(!svg)return;
  var s='<line x1="20" y1="560" x2="380" y2="560" stroke="#0A2A5E" stroke-width="2"/>';
  s+='<g id="mast"><rect x="330" y="40" width="10" height="520" fill="#B98A2E"/><rect x="120" y="36" width="250" height="8" fill="#B98A2E"/><line id="hook" x1="200" y1="44" x2="200" y2="120" stroke="#5B6880" stroke-width="1.5"/></g>';
  for(var i=0;i<4;i++)s+='<rect class="col" x="'+(70+i*80)+'" y="490" width="12" height="70" fill="#0A2A5E"/>';
  for(var f=0;f<5;f++){var y=490-(f+1)*80;
    s+='<g class="slab" data-i="'+f+'"><rect x="60" y="'+y+'" width="262" height="80" fill="#FFFFFF" stroke="#0A2A5E" stroke-width="2"/><rect x="78" y="'+(y+16)+'" width="96" height="44" fill="#E1E7F1" stroke="#0A2A5E" stroke-width="1.2"/><rect x="190" y="'+(y+16)+'" width="50" height="44" fill="#E1E7F1" stroke="#0A2A5E" stroke-width="1.2"/><rect x="254" y="'+(y+12)+'" width="52" height="52" fill="#E1E7F1" stroke="#0A2A5E" stroke-width="1.2"/></g>';}
  svg.innerHTML=s;
  if(!animate)return;
  var slabs=$$('#crane .slab'),chs=$$('.chapter');
  gsap.set(slabs,{y:-500,opacity:0});
  var tl=gsap.timeline({scrollTrigger:{trigger:'.chapters',start:'top 70%',end:'bottom 70%',scrub:.6}});
  slabs.forEach(function(sl,i){tl.to('#hook',{attr:{y2:80+(4-i)*20},duration:.2},i).to(sl,{y:0,opacity:1,duration:.8,ease:'bounce.out'},i+.1)});
  chs.forEach(function(c){gsap.from(c.children,{y:30,opacity:0,stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 75%'}})});
  $$('.duo .img').forEach(function(d,i){gsap.from(d,{clipPath:'inset(100% 0 0 0)',duration:1.3,ease:'power4.out',delay:i*.12,scrollTrigger:{trigger:d,start:'top 85%'}})});
};

M.buy=function(){
  var st={loc:'',bhk:'',floor:'',sort:''},g=$('#buyGrid');
  $('#bLoc').innerHTML='<option value="">All colonies</option>'+D.LOCS.map(function(l){return '<option>'+l.name+'</option>'}).join('');
  function parse(p){var n=parseFloat(p.replace(/[₹,\s]/g,''));return /Cr/.test(p)?n*1e7:n}
  function render(first){
    var items=D.LISTINGS.filter(function(x){return x.p==='sale'&&(!st.loc||x.loc===st.loc)&&(!st.bhk||String(x.bhk)===st.bhk)&&(!st.floor||x.floor===st.floor)});
    if(st.sort==='lo')items.sort(function(a,b){return parse(a.price)-parse(b.price)});if(st.sort==='hi')items.sort(function(a,b){return parse(b.price)-parse(a.price)});
    var state=(!first&&animate&&window.Flip)?Flip.getState('#buyGrid .card'):null;
    g.innerHTML=items.length?items.map(cardHTML).join(''):'<div class="empty">Nothing listed with these filters right now. Call <b>'+D.PHONE+'</b> and ask what is coming up off-market.</div>';
    $('#bCount').textContent=items.length+(items.length===1?' home':' homes');
    if(state)Flip.from(state,{duration:.7,ease:'power3.inOut',absolute:true,onEnter:function(el){return gsap.fromTo(el,{opacity:0,scale:.9},{opacity:1,scale:1,duration:.6})},onLeave:function(el){return gsap.to(el,{opacity:0,scale:.9,duration:.4})}});
    else if(first&&animate)gsap.from('#buyGrid .card',{y:50,opacity:0,stagger:.07,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#buyGrid',start:'top 85%'}});
  }
  [['#bLoc','loc'],['#bBhk','bhk'],['#bFloor','floor'],['#bSort','sort']].forEach(function(p){$(p[0]).addEventListener('change',function(e){st[p[1]]=e.target.value;render()})});
  render(true);
  /* blueprint hero: plan draws, then the blueprint wipes away to reveal the photo */
  var bp=$('#bp');if(!bp)return;
  bp.innerHTML='<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice"><path pathLength="1" d="M200 140H1000V600H200Z"/><path pathLength="1" d="M200 360H520V600M520 140V600M520 300H760V600M760 140V420H1000M860 420V600"/><path pathLength="1" d="M300 200h120v100H300z M600 200h100v60H600z M820 200h120v120H820z"/><path pathLength="1" d="M200 110H1000M200 100V120M1000 100V120"/></svg>';
  if(!animate){bp.style.display='none';return}
  var ps=$$('#bp path');gsap.set(ps,{strokeDasharray:1,strokeDashoffset:1});
  gsap.timeline({delay:.9}).to(ps,{strokeDashoffset:0,duration:1.1,stagger:.12,ease:'power2.inOut'}).to(bp,{clipPath:'inset(0 0 0 100%)',duration:1.2,ease:'power4.inOut'},'+=.15').set(bp,{display:'none'});
  gsap.set(bp,{clipPath:'inset(0 0 0 0%)'});
};

M.rent=function(){
  var st={loc:'',bhk:''},g=$('#keys');
  $('#rLoc').innerHTML='<option value="">All colonies</option>'+D.LOCS.map(function(l){return '<option>'+l.name+'</option>'}).join('');
  function tag(x){return '<article class="keytag" data-id="'+x.id+'"><span class="ring"></span><span class="string"></span><div class="tagbody"><span class="hole"></span>'+img(x.img,x.title)+'<div class="tb"><div class="loc">'+x.loc+' · '+x.floor+' floor</div><h3>'+x.title+'</h3><div class="rentp num">'+x.price+' <small>'+x.per+'</small></div><div class="meta"><span class="chip">'+x.bhk+' BHK</span><span class="chip">'+x.plot+'</span>'+x.extra.map(function(e){return '<span class="chip">'+e+'</span>'}).join('')+'</div><div class="acts"><a class="icon-btn wa" href="'+waURL('Hello MV Homes, I want to rent: '+x.title+', '+x.loc+' ('+x.price+x.per+').')+'" target="_blank" rel="noopener" aria-label="Ask on WhatsApp">'+ICON.wa+'</a><button class="btn" style="padding:10px 16px;flex:1" data-enquire="'+x.id+'">Book a visit</button></div></div></div></article>'}
  function swing(el,amt){if(!animate)return;gsap.fromTo(el,{rotation:amt},{rotation:0,duration:2.2,ease:'elastic.out(1,0.18)'})}
  function render(first){
    var items=D.LISTINGS.filter(function(x){return x.p==='rent'&&(!st.loc||x.loc===st.loc)&&(!st.bhk||String(x.bhk)===st.bhk)});
    g.innerHTML=items.length?items.map(tag).join(''):'<div class="empty">No rentals with these filters right now. Message us and we will tell you what is coming up.</div>';
    $('#rCount').textContent=items.length+(items.length===1?' home':' homes');
    var tags=$$('#keys .keytag');
    if(!animate)return;
    if(first){tags.forEach(function(t,i){gsap.set(t,{y:-140,opacity:0});ScrollTrigger.create({trigger:t,start:'top 92%',once:true,onEnter:function(){gsap.to(t,{y:0,opacity:1,duration:.7,delay:(i%4)*.09,ease:'power3.in',onComplete:function(){swing(t,(i%2?-1:1)*9)}})}})})}
    else tags.forEach(function(t,i){gsap.fromTo(t,{y:-80,opacity:0},{y:0,opacity:1,duration:.55,delay:i*.05,ease:'power3.in',onComplete:function(){swing(t,(i%2?-1:1)*8)}})});
    tags.forEach(function(t){t.addEventListener('mouseenter',function(){swing(t,(Math.random()<.5?-1:1)*4)})});
  }
  $('#rLoc').addEventListener('change',function(e){st.loc=e.target.value;render()});
  $('#rBhk').addEventListener('change',function(e){st.bhk=e.target.value;render()});
  render(true);
  if(animate)gsap.from('.rail',{scaleX:0,transformOrigin:'left',duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.rail',start:'top 90%'}});
};

M.sell=function(){
  var sb=$('#signboard');
  if(animate){
    gsap.fromTo(sb,{rotation:-14},{rotation:0,duration:2.4,ease:'elastic.out(1,0.2)',delay:1});
    ScrollTrigger.create({trigger:'#checklist',start:'top 60%',onEnter:function(){sb.classList.add('sold');gsap.fromTo(sb,{rotation:10},{rotation:0,duration:2,ease:'elastic.out(1,0.2)'})},onLeaveBack:function(){sb.classList.remove('sold')}});
    setTimeout(function(){if(scrollY<50){sb.classList.add('sold');setTimeout(function(){if(scrollY<50)sb.classList.remove('sold')},1800)}},3200);
    $$('#checklist li').forEach(function(li){ScrollTrigger.create({trigger:li,start:'top 65%',onEnter:function(){li.classList.add('done')},onLeaveBack:function(){li.classList.remove('done')}})});
  } else {$$('#checklist li').forEach(function(li){li.classList.add('done')})}
  $$('.signclick').forEach(function(b){b.addEventListener('click',function(){sb.classList.toggle('sold')})});
};

M.localities=function(){
  var svg=$('#mapSvg'),HQ=D.LOCS[0];
  var s='<path class="road" d="M120 0 C150 200 170 400 140 600"/><path class="road" d="M0 210 C200 200 400 215 600 190"/><path class="road" d="M0 410 C200 400 420 420 600 395"/><path class="road" d="M370 0 C360 200 380 420 360 600"/>';
  D.LOCS.slice(1).forEach(function(l){s+='<path class="ray" pathLength="1" d="M'+HQ.x+' '+HQ.y+' L'+l.x+' '+l.y+'"/>'});
  s+='<g class="landmark"><path d="M130 520 l6 -46 l6 46z" fill="none" stroke="rgba(231,236,245,.4)" stroke-width="1.5"/><text x="136" y="540" text-anchor="middle" font-size="11" fill="rgba(231,236,245,.45)" font-family="Hanken Grotesk,Arial">Qutub Minar</text></g>';
  D.LOCS.forEach(function(l,i){
    var anchor=l.x>460?'end':'start',dx=l.x>460?-14:14;
    if(i===0)s+='<g class="pin hq on" data-k="'+l.k+'" tabindex="0" role="button" aria-label="'+l.name+'"><circle class="halo" cx="'+l.x+'" cy="'+l.y+'" r="22"/><circle cx="'+l.x+'" cy="'+l.y+'" r="9"/><text x="'+(l.x+16)+'" y="'+(l.y+5)+'">MV Homes · '+l.name+'</text></g>';
    else s+='<g class="pin" data-k="'+l.k+'" tabindex="0" role="button" aria-label="'+l.name+'"><circle class="halo" cx="'+l.x+'" cy="'+l.y+'" r="18"/><circle class="dot" cx="'+l.x+'" cy="'+l.y+'" r="6"/><text x="'+(l.x+dx)+'" y="'+(l.y+4)+'" text-anchor="'+anchor+'">'+l.name+'</text></g>';
  });
  s+='<g transform="translate(560 40)"><line x1="0" y1="18" x2="0" y2="0" stroke="#F4C766" stroke-width="1.5"/><path d="M-5 6 L0 -4 L5 6Z" fill="#F4C766"/><text x="0" y="34" text-anchor="middle" font-size="11" fill="#F4C766" font-family="Archivo,Arial" font-weight="700">N</text></g>';
  svg.innerHTML=s;
  $('#locList').innerHTML=D.LOCS.map(function(l){return '<button type="button" data-k="'+l.k+'">'+l.name+'<span>'+l.stock+'</span></button>'}).join('');
  function show(k,scroll){
    var l=D.LOCS.filter(function(x){return x.k===k})[0];if(!l)return;
    $$('#mapSvg .pin').forEach(function(p){p.classList.toggle('on',p.dataset.k===k)});
    var n=D.LISTINGS.filter(function(x){return x.loc===l.name}).length;
    var c=$('#locCard');
    c.innerHTML=img(l.img,l.name)+'<div class="lb"><div class="eyebrow">'+l.stock+'</div><h3>'+l.name+'</h3><p>'+l.text+'</p><div class="row">'+l.tags.map(function(t){return '<span class="chip">'+t+'</span>'}).join('')+'</div><div class="form-actions" style="margin-top:6px"><a class="btn" href="buy.html">'+(n?n+' home'+(n>1?'s':'')+' on our books':'See homes for sale')+'</a><a class="btn wa" href="'+waURL('Hello MV Homes, I am looking for a property in '+l.name+'.')+'" target="_blank" rel="noopener">'+ICON.wa.replace('<svg','<svg width="18" height="18"')+'Ask</a></div></div>';
    if(animate)gsap.fromTo(c.children,{y:20,opacity:0},{y:0,opacity:1,stagger:.06,duration:.6,ease:'power3.out'});
    if(scroll&&mob())scrollToY(c.getBoundingClientRect().top+scrollY-90);
  }
  svg.addEventListener('click',function(e){var p=e.target.closest('.pin');if(p)show(p.dataset.k,true)});
  svg.addEventListener('keydown',function(e){var p=e.target.closest('.pin');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();show(p.dataset.k,true)}});
  $('#locList').addEventListener('click',function(e){var b=e.target.closest('button');if(b){show(b.dataset.k,false);scrollToY($('#mapTop').getBoundingClientRect().top+scrollY-90)}});
  show('malviya');
  if(animate){
    var rays=$$('#mapSvg .ray'),pins=$$('#mapSvg .pin:not(.hq)');
    gsap.set(rays,{strokeDasharray:'4 5',attr:{'stroke-dashoffset':0}});
    var tl=gsap.timeline({scrollTrigger:{trigger:'.map',start:'top 75%'}});
    tl.from('.map .road',{opacity:0,duration:.8}).from('#mapSvg .hq',{scale:0,transformOrigin:'center',svgOrigin:HQ.x+' '+HQ.y,duration:.6,ease:'back.out(3)'},'-=.3')
      .from(rays,{opacity:0,duration:.5,stagger:.05},'-=.1')
      .from(pins,{y:-40,opacity:0,duration:.7,stagger:.07,ease:'bounce.out'},'-=.4');
  }
};

M.process=function(){
  if(!animate)return;
  $$('.stair').forEach(function(s){
    gsap.set(s,{'--tread':0,'--riser':0});
    gsap.timeline({scrollTrigger:{trigger:s,start:'top 80%',end:'bottom 45%',scrub:.5}}).from(s.children,{x:-20,opacity:0,stagger:.05,duration:.3},0).to(s,{'--tread':1,duration:.5},0).to(s,{'--riser':1,duration:.4},.5);
  });
  gsap.from('.stamp',{scale:2.6,opacity:0,rotation:-40,duration:.5,ease:'power4.in',scrollTrigger:{trigger:'.stamp',start:'top 80%'},onComplete:function(){gsap.fromTo('.stamp-wrap',{x:-6},{x:0,duration:.4,ease:'elastic.out(1,.3)'})}});
};

M.gallery=function(){
  var G=[[D.IMG.liv1,'Living room, Malviya Nagar'],[D.IMG.kit2,'Modular kitchen'],[D.IMG.bed1,'Master bedroom'],[D.IMG.extDusk,'Builder floor at dusk'],[D.IMG.liv5,'Drawing room'],[D.IMG.balcony,'Balcony'],[D.IMG.bed3,'Bedroom'],[D.IMG.kit4,'Kitchen with island'],[D.IMG.liv4,'Lounge'],[D.IMG.extWhite,'Contemporary facade'],[D.IMG.bed4,'Guest bedroom'],[D.IMG.liv6,'Living and dining'],[D.IMG.kit1,'Open kitchen'],[D.IMG.extBalc,'Balconies'],[D.IMG.rail,'Glass railings']];
  $('#masonry').innerHTML=G.map(function(x,i){return '<figure data-i="'+i+'">'+img(x[0],x[1])+'<figcaption>'+x[1]+'</figcaption></figure>'}).join('');
  var lb=$('#lightbox'),cur=0;
  function showLB(i){cur=(i+G.length)%G.length;$('#lbImg').innerHTML='<img src="'+G[cur][0].replace('w=1400','w=2000')+'" alt="'+esc(G[cur][1])+'">';$('#lbCap').textContent=G[cur][1]+' · '+(cur+1)+' / '+G.length;if(lb.hidden){lb.hidden=false;if(lenis)lenis.stop();if(animate)gsap.from('#lbImg',{scale:.9,opacity:0,duration:.5,ease:'power3.out'})}}
  window.closeLightbox=function(){if(!lb.hidden){lb.hidden=true;if(lenis)lenis.start()}};
  $('#masonry').addEventListener('click',function(e){var f=e.target.closest('figure');if(f)showLB(+f.dataset.i)});
  $('#lbPrev').addEventListener('click',function(){showLB(cur-1)});$('#lbNext').addEventListener('click',function(){showLB(cur+1)});$('#lbClose').addEventListener('click',window.closeLightbox);
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='ArrowRight')showLB(cur+1);if(e.key==='ArrowLeft')showLB(cur-1)});
  if(!animate)return;
  /* pinned horizontal strip, each photo drifts inside its frame */
  var track=$('#track');
  var dist=function(){return Math.max(0,track.scrollWidth-window.innerWidth)};
  var h=gsap.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:'.hstrip',start:'top top',end:function(){return '+='+dist()},pin:true,scrub:.6,invalidateOnRefresh:true}});
  $$('.frame .img').forEach(function(f){gsap.fromTo(f,{xPercent:-6},{xPercent:6,ease:'none',scrollTrigger:{trigger:f.parentNode,containerAnimation:h,start:'left right',end:'right left',scrub:true}})});
  extraDark=function(y){var st=h.scrollTrigger;return st&&y<=st.end};
  gsap.from('.hstrip .intro > *',{y:30,opacity:0,stagger:.08,duration:.9,ease:'power3.out',delay:.9});
  gsap.utils.toArray('#masonry figure').forEach(function(f,i){gsap.from(f,{y:60,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:f,start:'top 92%'}})});
};

M.guide=function(){
  var A=$('#amt'),R=$('#rate'),T=$('#tenure');
  var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN')};
  var short=function(n){return n>=1e7?'₹'+(n/1e7).toFixed(2)+' Cr':'₹'+(n/1e5).toFixed(1)+' L'};
  var shown={emi:0,int:0,tot:0};
  function calc(){
    var p=+A.value*1e5,r=+R.value/1200,n=+T.value*12,emi=r?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n,tot=emi*n,int=tot-p;
    $('#amtOut').textContent=short(p);$('#rateOut').textContent=(+R.value).toFixed(2)+'%';$('#tenOut').textContent=T.value+' years';
    var frac=int/tot,C=2*Math.PI*54;
    var target={emi:emi,int:int,tot:tot};
    var paint=function(){$('#emi').textContent=inr(shown.emi);$('#intOut').textContent=short(shown.int);$('#totOut').textContent=short(shown.tot)};
    if(animate){gsap.to(shown,{emi:emi,int:int,tot:tot,duration:.6,ease:'power2.out',onUpdate:paint});gsap.to('#donutInt',{attr:{'stroke-dasharray':(C*frac)+' '+C},duration:.6,ease:'power2.out'})}
    else{shown=target;paint();$('#donutInt').setAttribute('stroke-dasharray',(C*frac)+' '+C)}
    $('#prinOut').textContent=short(p);
  }
  [A,R,T].forEach(function(x){x.addEventListener('input',calc)});calc();
  /* FAQ: smooth open/close */
  $$('.faq details').forEach(function(d){var s=d.querySelector('summary'),a=d.querySelector('.ans');
    s.addEventListener('click',function(e){if(!animate)return;e.preventDefault();
      if(d.open){gsap.to(a,{height:0,duration:.45,ease:'power3.inOut',onComplete:function(){d.open=false;a.style.height=''}})}
      else{d.open=true;gsap.fromTo(a,{height:0},{height:a.scrollHeight,duration:.55,ease:'power3.out',onComplete:function(){a.style.height=''}})}
    })});
  if(animate){$$('.cost .v').forEach(function(v){var to=parseFloat(v.dataset.to),o={n:0};gsap.to(o,{n:to,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:v,start:'top 85%'},onUpdate:function(){v.textContent=(to%1?o.n.toFixed(1):Math.round(o.n))+v.dataset.unit}})})}
};

M.contact=function(){
  /* open-now status in India time */
  function status(){var now=new Date(),ist=new Date(now.getTime()+(now.getTimezoneOffset()+330)*60000),h=ist.getHours()+ist.getMinutes()/60,open=h>=9&&h<21,el=$('#openState');
    el.classList.toggle('closed',!open);$('#openText').textContent=open?'Open now · closes 9:00 pm':'Closed now · opens 9:00 am';}
  status();setInterval(status,60000);
  if(!animate){$('.frame-door').style.display='none';return}
  gsap.timeline({delay:.95}).to('.leaf.l',{rotationY:-104,duration:1.8,ease:'power3.inOut'},0).to('.leaf.r',{rotationY:104,duration:1.8,ease:'power3.inOut'},0).set('.frame-door',{display:'none'})
    .from('.doorstage .content > *',{y:30,opacity:0,stagger:.1,duration:.9,ease:'power3.out'},.9)
    .from('.doorstage .behind img',{scale:1.15,duration:2.4,ease:'power2.out'},0);
  gsap.from('.cbox',{y:40,opacity:0,stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.cgrid',start:'top 85%'}});
};

if(M[PAGE])M[PAGE]();
reveals();
hdrState();
if(hasGsap)window.addEventListener('load',function(){ScrollTrigger.refresh();hdrState()});
})();
