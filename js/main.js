// ANO
document.getElementById('yr').textContent = new Date().getFullYear();

/* ====== LINHA + TESOURA: desce em linha reta e para em #servicos ====== */
const scissors = document.getElementById('floatingScissors');
const scissorLine = document.getElementById('scissorLine');
const servicosSection = document.getElementById('servicos');

let scissorsRaf = 0;
function moveScissors(){
  if(!scissors) return;
  const vh = window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const servTop = servicosSection ? servicosSection.offsetTop : (document.documentElement.scrollHeight - vh);
  const scrollEnd = Math.max(vh * 0.35, servTop - vh * 0.22);
  const t = Math.min(1, Math.max(0, scrollTop / scrollEnd));
  const maxTravel = Math.min(vh * 0.42, 340);
  const y = maxTravel * t;
  const tilt = -6 * (1 - t);
  scissors.style.transform = `translate(-35%, ${y}px) rotate(${tilt}deg)`;

  if(scissorLine){
    const r = scissors.getBoundingClientRect();
    const attach = r.top + r.height * 0.42;
    const h = Math.max(0, Math.min(attach, vh * 1.25));
    scissorLine.style.height = h + 'px';
    scissorLine.style.left = (r.left + r.width / 2 - 1) + 'px';
    scissorLine.classList.toggle('is-done', t >= 0.995);
  }
}

function scheduleScissors(){
  if(scissorsRaf) return;
  scissorsRaf = requestAnimationFrame(() => {
    scissorsRaf = 0;
    moveScissors();
  });
}

window.addEventListener('scroll', scheduleScissors, {passive:true});
window.addEventListener('resize', moveScissors);
moveScissors();

/* ====== MENU MOBILE ====== */
(function(){
  const nav = document.getElementById('siteNav');
  const btn = document.getElementById('navToggle');
  const menu = document.getElementById('siteMenu');
  if(!nav || !btn || !menu) return;
  function setOpen(open){
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
  window.addEventListener('resize', () => { if(window.innerWidth > 880) setOpen(false); });
})();

/* ====== REVEAL ON SCROLL ====== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ====== ANTES & DEPOIS ====== */
(function(){
  const ba = document.getElementById('ba');
  const before = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  if(!ba) return;
  let dragging = false;
  function setPos(x){
    const rect = ba.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    before.style.width = pct + '%';
    handle.style.left = pct + '%';
    
    // Evita compressão da imagem interna
    const img = before.querySelector('img');
    if(img) img.style.width = (10000 / pct) + '%';
  }
  const start = (e) => { dragging = true; };
  const move  = (e) => { if(!dragging) return; const x = (e.touches?e.touches[0].clientX:e.clientX); setPos(x); };
  const end   = () => dragging = false;
  ba.addEventListener('mousedown', start);
  ba.addEventListener('touchstart', start, {passive:true});
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:true});
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);
  ba.addEventListener('click', (e) => setPos(e.clientX));
})();

/* ====== GALERIA MODAL ====== */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
document.querySelectorAll('.g-item img').forEach(img => {
  img.parentElement.addEventListener('click', () => {
    modalImg.src = img.src;
    modal.classList.add('open');
  });
});
document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('open'); });

/* ====== EXPLODING OBJECTS ====== */
(function(){
  const stage = document.getElementById('explodeStage');
  if(!stage) return;
  stage.querySelectorAll('.explode-item').forEach(it => {
    const x = it.dataset.x || 0, y = it.dataset.y || 0, r = it.dataset.r || 0;
    it.style.setProperty('--tx', x+'px');
    it.style.setProperty('--ty', y+'px');
    it.style.setProperty('--tr', r+'deg');
  });
  
  const isMobile = window.innerWidth <= 880;
  
  if(!isMobile) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) stage.classList.add('exploded'); });
    }, {threshold:.4});
    obs.observe(stage);
  }
  
  stage.addEventListener('click', () => stage.classList.toggle('exploded'));
  stage.style.cursor = 'pointer';
  
  window.addEventListener('resize', () => {
    const nowMobile = window.innerWidth <= 880;
    if(!isMobile && nowMobile) {
      stage.classList.remove('exploded');
    }
  });
})();

/* ====== FORMULARIO -> WHATSAPP ====== */
function enviarWhats(e){
  e.preventDefault();
  const nome = document.getElementById('fNome').value.trim();
  const msg  = document.getElementById('fMsg').value.trim();
  const txt = `Olá Sil! Meu nome é ${nome}. ${msg}`;
  window.open(`https://api.whatsapp.com/send?phone=5511985773078&text=${encodeURIComponent(txt)}`, '_blank');
  return false;
}
window.enviarWhats = enviarWhats;
