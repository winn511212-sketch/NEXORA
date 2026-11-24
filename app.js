const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MN=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
let S,view={page:"dash",q:"",pg:1,range:90,rep:"sales",from:"",to:""};
function seed(){let r=7;const rnd=()=>(r=(r*9301+49297)%233280)/233280,day=d=>new Date(Date.now()-d*864e5).toISOString().slice(0,10);
 const products=[["Nexus Laptop Pro",1450,"Elektronika",24],["Aero Headphones",220,"Audio",60],["Pulse Watch",340,"Aksessuar",8],["Orbit Monitor 27",520,"Elektronika",15],["Flux Keyboard",130,"Aksessuar",5],["Vector Dock",180,"Aksessuar",40]].map((p,i)=>({id:"p"+i,name:p[0],price:p[1],cat:p[2],stock:p[3],min:10}));
 const customers=["Orion Group","Lumen LLC","Atlas Trade","Nova Retail","Helix Studio","Zenith Corp"].map((n,i)=>({id:"c"+i,name:n,email:n.split(" ")[0].toLowerCase()+"@example.com",phone:"+998 90 123 45 6"+i}));
 const sales=[];for(let i=0;i<60;i++){const x=rnd();sales.push({id:"s"+i,date:day(Math.floor(rnd()*180)),pid:"p"+Math.floor(rnd()*6),cid:"c"+Math.floor(rnd()*6),qty:1+Math.floor(rnd()*4),status:x<.8?"completed":x<.9?"pending":"cancelled"})}
 const cats=["Ijara","Maosh","Reklama","Logistika"],expenses=[];for(let i=0;i<26;i++)expenses.push({id:"e"+i,date:day(Math.floor(rnd()*180)),title:cats[i%4]+" to‘lovi",cat:cats[i%4],amount:Math.round(150+rnd()*1100)});
 const team=[{id:"t0",name:"Demo Egasi",email:"demo@nexora.app",role:"Egasi"},{id:"t1",name:"Madina K.",email:"madina@example.com",role:"Menejer"},{id:"t2",name:"Jasur T.",email:"jasur@example.com",role:"Kuzatuvchi"}];
 return {company:"Demo Kompaniya",cur:"USD",theme:"dark",products,customers,sales,expenses,team}}
try{S=JSON.parse(localStorage.getItem("nexora"))}catch(e){}if(!S)S=seed();
const save=()=>{try{localStorage.setItem("nexora",JSON.stringify(S))}catch(e){}};
document.documentElement.dataset.theme=S.theme;
const P=id=>S.products.find(x=>x.id==id),C=id=>S.customers.find(x=>x.id==id);
const tot=s=>(P(s.pid)?.price||0)*s.qty,fmt=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:S.cur,maximumFractionDigits:0}).format(n);
const ST={completed:"Yakunlangan",pending:"Kutilmoqda",cancelled:"Bekor qilingan"};
const bd=s=>`<span class="bd ${s}">${ST[s]}</span>`;
function toast(m){const d=document.createElement("div");d.textContent=m;$("#toast").append(d);setTimeout(()=>d.remove(),2600)}
const spent=c=>S.sales.filter(s=>s.cid==c.id&&s.status=="completed").reduce((a,s)=>a+tot(s),0);
const sold=p=>S.sales.filter(s=>s.pid==p.id&&s.status=="completed").reduce((a,s)=>a+s.qty,0);
const E={
 sales:{t:"Sotuvlar",n:"Yangi sotuv",f:[{k:"date",l:"Sana",t:"date",d:new Date().toISOString().slice(0,10)},{k:"pid",l:"Mahsulot",t:"sel",o:()=>S.products.map(p=>[p.id,p.name])},{k:"cid",l:"Mijoz",t:"sel",o:()=>S.customers.map(c=>[c.id,c.name])},{k:"qty",l:"Soni",t:"number",d:1},{k:"status",l:"Holat",t:"sel",o:()=>Object.entries(ST)}],
  c:[["Sana",r=>r.date],["Mahsulot",r=>esc(P(r.pid)?.name)],["Mijoz",r=>esc(C(r.cid)?.name)],["Soni",r=>r.qty],["Summa",r=>fmt(tot(r))],["Holat",r=>bd(r.status)]],sort:(a,b)=>b.date.localeCompare(a.date)},
 products:{t:"Mahsulotlar",n:"Yangi mahsulot",f:[{k:"name",l:"Nomi",t:"text"},{k:"cat",l:"Kategoriya",t:"text"},{k:"price",l:"Narx",t:"number"},{k:"stock",l:"Zaxira",t:"number"},{k:"min",l:"Minimal zaxira",t:"number",d:10}],
  c:[["Nomi",r=>esc(r.name)],["Kategoriya",r=>esc(r.cat)],["Narx",r=>fmt(r.price)],["Zaxira",r=>r.stock+(r.stock<=r.min?' <span class="bd bad">Kam qoldi</span>':"")],["Sotilgan",r=>sold(r)]]},
 customers:{t:"Mijozlar",n:"Yangi mijoz",f:[{k:"name",l:"Ism / kompaniya",t:"text"},{k:"email",l:"Email",t:"email"},{k:"phone",l:"Telefon",t:"text"}],
  c:[["Mijoz",r=>esc(r.name)],["Email",r=>esc(r.email)],["Telefon",r=>esc(r.phone)],["Buyurtmalar",r=>S.sales.filter(s=>s.cid==r.id&&s.status=="completed").length],["Xarid summasi",r=>fmt(spent(r))],["Segment",r=>{const v=spent(r);return v>=4000?"VIP":v>=1500?"Faol":"Yangi"}]]},
 expenses:{t:"Xarajatlar",n:"Yangi xarajat",f:[{k:"date",l:"Sana",t:"date",d:new Date().toISOString().slice(0,10)},{k:"title",l:"Nomi",t:"text"},{k:"cat",l:"Kategoriya",t:"text"},{k:"amount",l:"Summa",t:"number"}],
  c:[["Sana",r=>r.date],["Nomi",r=>esc(r.title)],["Kategoriya",r=>esc(r.cat)],["Summa",r=>fmt(r.amount)]],sort:(a,b)=>b.date.localeCompare(a.date)},
 team:{t:"Jamoa",n:"A’zo taklif qilish",f:[{k:"name",l:"Ism",t:"text"},{k:"email",l:"Email",t:"email"},{k:"role",l:"Rol",t:"sel",o:()=>["Admin","Menejer","Kuzatuvchi"].map(x=>[x,x])}],
  c:[["Ism",r=>esc(r.name)],["Email",r=>esc(r.email)],["Rol",r=>esc(r.role)]]}
};
const NAV=[["dash","Boshqaruv paneli"],["sales","Sotuvlar"],["products","Mahsulotlar"],["customers","Mijozlar"],["expenses","Xarajatlar"],["reports","Hisobotlar"],["team","Jamoa"],["settings","Sozlamalar"]];
function go(p){view.page=p;view.q="";view.pg=1;location.hash=p;render()}
function render(){
 $("#nav").innerHTML=`<div class="logo">NEXORA</div><div class="tag">Biznes tahlili platformasi</div>`+NAV.map(n=>`<a href="#${n[0]}" class="${view.page==n[0]?"on":""}">${n[1]}</a>`).join("")+`<div class="demo">Demo ma’lumotlar — namuna uchun</div>`;
 const fn={dash,reports,settings}[view.page];fn?fn():list(view.page)}
window.onhashchange=()=>{const h=location.hash.slice(1);if(NAV.some(n=>n[0]==h)&&h!=view.page){view.page=h;view.q="";view.pg=1;render()}};
const inR=(d,a,b)=>{const t=new Date(d).getTime();return t>=a&&t<b};
function dash(){
 const D=+view.range,end=Date.now()+864e5,st=end-D*864e5,ps=st-D*864e5,done=S.sales.filter(s=>s.status=="completed");
 const rev=(a,b)=>done.filter(s=>inR(s.date,a,b)).reduce((x,s)=>x+tot(s),0);
 const R=rev(st,end),Pv=rev(ps,st),sc=done.filter(s=>inR(s.date,st,end)),X=S.expenses.filter(e=>inR(e.date,st,end)).reduce((a,e)=>a+e.amount,0);
 const gr=Pv?(R-Pv)/Pv*100:null,aov=sc.length?R/sc.length:0;
 const kp=[["Umumiy daromad",fmt(R)],["Sotuvlar soni",sc.length],["Xarajatlar",fmt(X)],["Sof foyda",`<span class="${R-X>=0?"ok":"bad"}">${fmt(R-X)}</span>`],["Daromad o‘sishi",gr==null?"—":`<span class="${gr>=0?"ok":"bad"}">${gr>=0?"+":""}${gr.toFixed(1)}%</span>`],["O‘rtacha chek",fmt(aov)]];
 const m=[];for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");m.push({l:MN[d.getMonth()],r:done.filter(s=>s.date.startsWith(k)).reduce((a,s)=>a+tot(s),0),e:S.expenses.filter(x=>x.date.startsWith(k)).reduce((a,x)=>a+x.amount,0)})}
 const mx=Math.max(1,...m.flatMap(x=>[x.r,x.e])),bw=34;
 const svg=`<svg viewBox="0 0 560 220" width="100%" role="img" aria-label="Daromad va xarajatlar">${m.map((x,i)=>{const h1=x.r/mx*150,h2=x.e/mx*150,o=i*92+20;return `<rect x="${o}" y="${180-h1}" width="${bw}" height="${h1}" rx="6" fill="var(--c)"><title>${x.l} daromad: ${fmt(x.r)}</title></rect><rect x="${o+bw+4}" y="${180-h2}" width="${bw}" height="${h2}" rx="6" fill="var(--v)"><title>${x.l} xarajat: ${fmt(x.e)}</title></rect><text x="${o+bw}" y="203" text-anchor="middle" fill="var(--m)" font-size="12">${x.l}</text>`}).join("")}</svg>`;
 const tp={};sc.forEach(s=>{const p=P(s.pid);if(p){tp[p.id]=tp[p.id]||{n:p.name,q:0,r:0};tp[p.id].q+=s.qty;tp[p.id].r+=tot(s)}});
 const top=Object.values(tp).sort((a,b)=>b.r-a.r).slice(0,5),tm=top[0]?.r||1;
 const rc=[...S.sales].sort(E.sales.sort).slice(0,6);
 $("#main").innerHTML=`<div class="top"><div><h1>Boshqaruv paneli</h1><div class="sub">${esc(S.company)} — ko‘rsatkichlar bazadagi yozuvlardan hisoblanadi</div></div>
 <select onchange="view.range=this.value;render()">${[[30,"Oxirgi 30 kun"],[90,"Oxirgi 90 kun"],[180,"Oxirgi 180 kun"]].map(o=>`<option value="${o[0]}" ${D==o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>
 <div class="grid">${kp.map(k=>`<div class="card kpi"><small>${k[0]}</small><b>${k[1]}</b></div>`).join("")}</div>
 <div class="two"><div class="card"><h3>Daromad va xarajatlar (6 oy)</h3>${svg}<small style="color:var(--c)">■ Daromad</small> <small style="color:var(--v)">■ Xarajat</small></div>
 <div class="card"><h3>Eng yaxshi mahsulotlar</h3>${top.length?top.map(t=>`<div>${esc(t.n)} <small style="color:var(--m)">· ${t.q} dona · ${fmt(t.r)}</small></div><div class="bar"><i style="width:${t.r/tm*100}%"></i></div>`).join(""):'<div class="empty">Sotuvlar yo‘q</div>'}</div></div>
 <div class="card"><h3>So‘nggi tranzaksiyalar</h3><div class="tw"><table><tr><th>Sana</th><th>Mijoz</th><th>Mahsulot</th><th>Summa</th><th>Holat</th></tr>${rc.map(s=>`<tr><td>${s.date}</td><td>${esc(C(s.cid)?.name)}</td><td>${esc(P(s.pid)?.name)}</td><td>${fmt(tot(s))}</td><td>${bd(s.status)}</td></tr>`).join("")}</table></div></div>`}
function list(k){
 const e=E[k],q=view.q.toLowerCase();let rows=[...S[k]];if(e.sort)rows.sort(e.sort);
 rows=rows.filter(r=>e.c.map(c=>c[1](r)).join(" ").toLowerCase().includes(q));
 const pp=8,pages=Math.max(1,Math.ceil(rows.length/pp));view.pg=Math.min(view.pg,pages);const sl=rows.slice((view.pg-1)*pp,view.pg*pp);
 let extra="";if(k=="expenses"){const g={};S.expenses.forEach(x=>g[x.cat]=(g[x.cat]||0)+x.amount);const t=Object.values(g).reduce((a,b)=>a+b,0)||1;
  extra=`<div class="card" style="margin-bottom:14px"><h3>Xarajatlar taqsimoti</h3>${Object.entries(g).map(([n,v])=>`<div>${esc(n)} <small style="color:var(--m)">${fmt(v)} · ${(v/t*100).toFixed(0)}%</small></div><div class="bar"><i style="width:${v/t*100}%"></i></div>`).join("")}</div>`}
 $("#main").innerHTML=`<div class="top"><div><h1>${e.t}</h1><div class="sub">Jami: ${rows.length}</div></div><div class="row"><input id="q" placeholder="Qidirish…" value="${esc(view.q)}"><button class="pri" onclick="form('${k}')">+ ${e.n}</button></div></div>${extra}
 <div class="card"><div class="tw">${sl.length?`<table><tr>${e.c.map(c=>`<th>${c[0]}</th>`).join("")}<th></th></tr>${sl.map(r=>`<tr>${e.c.map(c=>`<td>${c[1](r)}</td>`).join("")}<td class="row"><button onclick="form('${k}','${r.id}')">Tahrir</button><button onclick="del('${k}','${r.id}',this)">O‘chirish</button></td></tr>`).join("")}</table>`:'<div class="empty">Hech narsa topilmadi</div>'}</div>
 <div class="pg"><button ${view.pg<2?"disabled":""} onclick="view.pg--;render()">←</button>${view.pg} / ${pages}<button ${view.pg>=pages?"disabled":""} onclick="view.pg++;render()">→</button></div></div>`;
 const q2=$("#q");q2.oninput=()=>{view.q=q2.value;view.pg=1;const p=q2.selectionStart;render();const n=$("#q");n.focus();n.setSelectionRange(p,p)}}
function form(k,id){
 const e=E[k],r=id?S[k].find(x=>x.id==id):{};
 $("#modal").innerHTML=`<form class="card"><h3>${id?"Tahrirlash":e.n}</h3>${e.f.map(f=>`<label>${f.l}${f.t=="sel"?`<select name="${f.k}">${f.o().map(o=>`<option value="${esc(o[0])}" ${r[f.k]==o[0]?"selected":""}>${esc(o[1])}</option>`).join("")}</select>`:`<input name="${f.k}" type="${f.t}" value="${esc(r[f.k]??f.d??"")}" required ${f.t=="number"?'min="0" step="any"':""}>`}</label>`).join("")}<div class="row" style="justify-content:flex-end"><button type="button" onclick="closeM()">Bekor</button><button class="pri">Saqlash</button></div></form>`;
 $("#modal").style.display="grid";
 $("#modal form").onsubmit=ev=>{ev.preventDefault();const fd=new FormData(ev.target),o={};
  for(const f of e.f)o[f.k]=f.t=="number"?+fd.get(f.k):String(fd.get(f.k)).trim();
  if((k=="sales"&&o.qty<1)||(k=="sales"&&(!P(o.pid)||!C(o.cid)))){toast("Ma’lumot noto‘g‘ri");return}
  if(id)Object.assign(r,o);else S[k].push({id:k[0]+Date.now(),...o});
  save();closeM();toast("Saqlandi");render()}}
function closeM(){$("#modal").style.display="none"}
$("#modal").onclick=e=>{if(e.target.id=="modal")closeM()};
function del(k,id,b){
 if(!b.dataset.s){b.dataset.s=1;b.textContent="Aniqmi?";setTimeout(()=>{b.dataset.s="";b.textContent="O‘chirish"},2500);return}
 S[k]=S[k].filter(x=>x.id!=id);
 if(k=="products")S.sales=S.sales.filter(s=>s.pid!=id);if(k=="customers")S.sales=S.sales.filter(s=>s.cid!=id);
 save();toast("O‘chirildi");render()}
function repRows(){
 const t=new Date(view.to||"2100-01-01").getTime()+864e5,f=new Date(view.from||"1970-01-01").getTime(),ok=d=>inR(d,f,t);
 if(view.rep=="expenses")return[["Sana","Nomi","Kategoriya","Summa"],...S.expenses.filter(x=>ok(x.date)).map(x=>[x.date,x.title,x.cat,x.amount])];
 const s=S.sales.filter(x=>ok(x.date)&&(view.rep=="sales"||x.status=="completed"));
 return[["Sana","Mahsulot","Mijoz","Soni","Summa","Holat"],...s.map(x=>[x.date,P(x.pid)?.name,C(x.cid)?.name,x.qty,tot(x),ST[x.status]])]}
function reports(){
 const rows=repRows();
 $("#main").innerHTML=`<div class="top"><div><h1>Hisobotlar</h1><div class="sub">Turni va sanani tanlang, so‘ng CSV sifatida yuklab oling</div></div></div>
 <div class="card"><div class="row" style="margin-bottom:14px"><select onchange="view.rep=this.value;render()">${[["sales","Sotuvlar hisoboti"],["revenue","Daromad hisoboti"],["expenses","Xarajatlar hisoboti"]].map(o=>`<option value="${o[0]}" ${view.rep==o[0]?"selected":""}>${o[1]}</option>`).join("")}</select>
 <input type="date" value="${view.from}" onchange="view.from=this.value;render()"><input type="date" value="${view.to}" onchange="view.to=this.value;render()"><button class="pri" onclick="csv()">CSV yuklab olish</button></div>
 <div class="tw">${rows.length>1?`<table><tr>${rows[0].map(h=>`<th>${h}</th>`).join("")}</tr>${rows.slice(1,31).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>`:'<div class="empty">Tanlangan davrda yozuv yo‘q</div>'}</div><div class="pg">Jami qator: ${rows.length-1}</div></div>`}
async function csv(){
 const rows=repRows();if(rows.length<2){toast("Yozuv yo‘q");return}
 const data="\ufeff"+rows.map(r=>r.map(c=>{c=String(c??"");if(/^[=+\-@]/.test(c))c="'"+c;return `"${c.replace(/"/g,'""')}"`}).join(",")).join("\n");
 try{const fn=`nexora-${view.rep}.csv`;if(typeof claude!=="undefined"){const d=await claude.use("downloads");if(!d){toast("Yuklab bo‘lmadi");return}await d.save({filename:fn,data})}else{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"text/csv"}));a.download=fn;a.click();URL.revokeObjectURL(a.href)}toast("Hisobot tayyor")}catch(e){if(e&&e.code!="declined")toast("Yuklab bo‘lmadi")}}
function settings(){
 $("#main").innerHTML=`<div class="top"><div><h1>Sozlamalar</h1><div class="sub">Kompaniya, valyuta va mavzu</div></div></div>
 <div class="card" style="max-width:480px;display:grid;gap:12px"><label>Kompaniya nomi<input id="sc" value="${esc(S.company)}"></label>
 <label>Valyuta<select id="sv">${["USD","EUR","UZS","RUB"].map(c=>`<option ${S.cur==c?"selected":""}>${c}</option>`).join("")}</select></label>
 <label>Mavzu<select id="st"><option value="dark" ${S.theme=="dark"?"selected":""}>Qorong‘i</option><option value="light" ${S.theme=="light"?"selected":""}>Yorug‘</option></select></label>
 <div class="row"><button class="pri" onclick="S.company=$('#sc').value.trim()||S.company;S.cur=$('#sv').value;S.theme=$('#st').value;document.documentElement.dataset.theme=S.theme;save();toast('Saqlandi');render()">Saqlash</button>
 <button onclick="if(!this.dataset.s){this.dataset.s=1;this.textContent='Aniqmi?';return}S=seed();save();toast('Demo ma’lumotlar tiklandi');render()">Demo ma’lumotlarni tiklash</button>
 <button onclick="localStorage.removeItem('nx_auth');location.reload()">Chiqish</button></div></div>`}
$("#lf").onsubmit=ev=>{ev.preventDefault();const f=new FormData(ev.target);
 if(f.get("e")=="demo@nexora.app"&&f.get("p")=="demo1234"){try{localStorage.setItem("nx_auth","1")}catch(e){}$("#login").remove();render()}else toast("Email yoki parol noto‘g‘ri")};
try{if(localStorage.getItem("nx_auth"))$("#login").remove()}catch(e){}
const h0=location.hash.slice(1);if(NAV.some(n=>n[0]==h0))view.page=h0;
render();
