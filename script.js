
const fmt=n=>n.toLocaleString('fa-IR')+' تومان';
const P=(id,name,cat,price,old,hue)=>({id,name,cat,price,old,hue});
const best=[P(1,'مخمل ایرانی سلطنتی','پارچه مبلی',420000,0,350),P(2,'کتان مبلی طرح‌دار','پارچه مبلی',350000,0,30),P(3,'حریر ساده سفید','پارچه پرده',180000,0,200),P(4,'ولوم دورو','پارچه پرده',390000,0,140),P(5,'ترگال رومیزی گندم','پارچه رومیزی',210000,0,45),P(6,'ساتن ابریشمی','پارچه لباس',260000,0,300),P(7,'کرپ حریر مجلسی','پارچه لباس',230000,0,260),P(8,'پارچه کودک طرح ابر','پارچه کودک',160000,0,190)];
const sale=[P(11,'مخمل زمینه لیمویی','پارچه مبلی',310000,430000,60),P(12,'بلک‌اوت ضد نور','پارچه پرده',340000,380000,230),P(13,'رومیزی کلاسیک کرم','پارچه رومیزی',190000,205000,40),P(14,'پیراهنی گلدار','پارچه لباس',150000,165000,330)];
const flaw=[P(21,'تکه‌پارچه مخمل ۱ متری','تکه‌پارچه',99000,0,10),P(22,'تکه‌پارچه کتان ۲ متری','تکه‌پارچه',129000,0,100),P(23,'ضایعات ساتن بسته ۵ تایی','تکه‌پارچه',149000,0,280)];
const all=[...best,...sale,...flaw];
let cart=[];
const $=s=>document.querySelector(s);
const card=p=>`<article class="card">${p.old?`<span class="badge">-${Math.round((1-p.price/p.old)*100).toLocaleString('fa-IR')}٪</span>`:''}<div class="im" style="background:repeating-linear-gradient(45deg,hsl(${p.hue} 45% 62%) 0 6px,hsl(${p.hue} 45% 70%) 6px 12px)"></div><small>${p.cat}</small><h4>${p.name}</h4><div class="price">${p.old?`<del>${fmt(p.old)}</del>`:''}${fmt(p.price)} <small>/ متر</small></div><button class="btn" data-id="${p.id}">افزودن به سبد</button></article>`;
const render=(sel,a)=>{$(sel).innerHTML=a.map(card).join('')};
render('#gridBest',best);render('#gridSale',sale);render('#gridFlaw',flaw);

const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};
function drawCart(){
  $('#cartCount').textContent=cart.reduce((s,i)=>s+i.q,0).toLocaleString('fa-IR');
  $('#cartTotal').textContent=fmt(cart.reduce((s,i)=>s+i.q*i.p.price,0));
  $('#cartItems').innerHTML=cart.length?cart.map(i=>`<div class="ci"><span>${i.p.name}<br><small>${fmt(i.p.price)}</small></span><span><button data-d="${i.p.id}">−</button> ${i.q.toLocaleString('fa-IR')} <button data-a="${i.p.id}">+</button></span></div>`).join(''):'<p>سبد خرید خالی است. محصولی اضافه کنید.</p>';
}
document.addEventListener('click',e=>{
  const t=e.target,id=+(t.dataset.id||t.dataset.a||t.dataset.d||0);
  if(t.dataset.id||t.dataset.a){const p=all.find(x=>x.id===id),i=cart.find(x=>x.p.id===id);i?i.q++:cart.push({p,q:1});drawCart();if(t.dataset.id)toast('به سبد خرید اضافه شد')}
  if(t.dataset.d){const i=cart.find(x=>x.p.id===id);if(--i.q<1)cart=cart.filter(x=>x!==i);drawCart()}
  if(t.closest('.open-popup'))$('#popup').classList.add('show');
});
$('#cartBtn').onclick=()=>$('#drawer').classList.add('open');
$('#closeCart').onclick=()=>$('#drawer').classList.remove('open');
$('#checkout').onclick=()=>toast(cart.length?'برای نهایی‌سازی، به درگاه پرداخت متصل کنید':'سبد خرید خالی است');
$('#closePopup').onclick=()=>$('#popup').classList.remove('show');
$('#popup').onclick=e=>{if(e.target.id==='popup')e.target.classList.remove('show')};
$('#wform').onsubmit=e=>{e.preventDefault();e.target.hidden=true;$('#ok').hidden=false};
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');
$('.search').onsubmit=e=>{e.preventDefault();const q=$('#q').value.trim();const r=all.filter(p=>p.name.includes(q)||p.cat.includes(q));render('#gridBest',q?r:best);location.hash='best'};

let cur=0;const n=3,sl=$('#slides'),dots=$('#dots');
dots.innerHTML=[...Array(n)].map((_,i)=>`<button aria-label="اسلاید ${i+1}"></button>`).join('');
function go(i){cur=(i+n)%n;sl.style.transform=`translateX(${-cur*100}%)`;[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===cur))}
[...dots.children].forEach((d,k)=>d.onclick=()=>go(k));
$('#next').onclick=()=>go(cur+1);$('#prev').onclick=()=>go(cur-1);go(0);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(()=>go(cur+1),4500);
drawCart();
