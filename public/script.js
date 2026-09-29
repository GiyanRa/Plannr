// ═══ CONFIG ═══════════════════════════════════════════════
const CATS=['Website Redesign','Mobile App','Branding','General','Marketing','Backend','Design','Research','Other'];
const PRIOS=['High','Medium','Low'];
const PCOLORS=['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#db2777','#0891b2','#65a30d'];
const DEPTS=['Engineering','Design','Marketing','Product','HR','Finance','Operations','Sales'];
const MONTHS_LG=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SH=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TC={'Website Redesign':'tbl','Mobile App':'ttl','Branding':'tor','General':'tgy','Marketing':'tpu','Backend':'tpk','Design':'tcy','Research':'trd','Other':'tgy'};
const CBGS={'Website Redesign':'#eff6ff','Mobile App':'#ccfbf1','Branding':'#ffedd5','General':'#f3f4f6','Marketing':'#ede9fe','Backend':'#fce7f3','Design':'#cffafe','Research':'#fee2e2','Other':'#f3f4f6'};
const CICS={'Website Redesign':'🖥️','Mobile App':'📱','Branding':'🎨','General':'📋','Marketing':'📣','Backend':'⚙️','Design':'✏️','Research':'🔬','Other':'📌'};
const AVCOLS=['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#db2777','#0891b2'];
const CEVCOLS={'Website Redesign':'#dbeafe:#1d4ed8','Mobile App':'#ccfbf1:#0f766e','Branding':'#ffedd5:#c2410c','General':'#f3f4f6:#4b5563','Marketing':'#ede9fe:#6d28d9','Backend':'#fce7f3:#be185d','Design':'#cffafe:#0e7490','Research':'#fee2e2:#dc2626','Other':'#f3f4f6:#4b5563'};

// ═══ STATE ════════════════════════════════════════════════
let S={tasks:[],projects:[],team:[],settings:{name:'Login',role:'Click to authenticate',email:'',notif:true,remind:false,weekly:false}};
let CH={};
let curP='dashboard',sbCol=false;
let mc={y:0,m:0},fc={y:0,m:0};
let eid=null,mtype=null;
let tTab='all',tSearch='',tFilt={prio:'all',cat:'all'};
let pCol=PCOLORS[0];

// ═══ PERSISTENCE ══════════════════════════════════════════
async function load(){
  try{
    const key = window.USER_KEY || 'tly3';
    const d=JSON.parse(localStorage.getItem(key)||'{}');
    if(d.tasks)S.tasks=d.tasks;
    if(d.projects)S.projects=d.projects;
    if(d.team)S.team=d.team;
    if(d.settings)Object.assign(S.settings,d.settings);
  }catch(e){}
  
  try {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    if(data.tasks) {
       S.tasks = data.tasks;
       nav(curP); 
    }
  } catch(e){}
}
function save(){
  const key = window.USER_KEY || 'tly3';
  localStorage.setItem(key,JSON.stringify(S));
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrf) {
    fetch('/api/tasks/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
      body: JSON.stringify({ tasks: S.tasks })
    }).catch(e=>{});
  }
}

// ═══ UTILS ════════════════════════════════════════════════
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const uid=()=>Date.now()+Math.floor(Math.random()*9999);
const inits=n=>n.split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,2);
const fmtD=s=>{if(!s)return'—';const d=new Date(s+'T00:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});};
const fmtDs=s=>{if(!s)return'—';const d=new Date(s+'T00:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});};
function isOver(t){return t.status!=='done'&&t.dueDate&&new Date(t.dueDate)<new Date(new Date().toDateString());}
function sInfo(t){if(isOver(t))return{c:'sov',l:'Overdue'};return{todo:{c:'std',l:'To Do'},inprogress:{c:'sip',l:'In Progress'},done:{c:'sdn',l:'Done'}}[t.status]||{c:'std',l:'To Do'};}
function pc(p){return{High:'bhi',Medium:'bme',Low:'blo'}[p]||'blo';}
function tc(c){return TC[c]||'tgy';}

function toast(msg,type='info'){
  const ic={info:'ℹ️',ok:'✅',err:'❌',warn:'⚠️'}[type]||'ℹ️';
  const el=document.createElement('div');
  el.className=`tos ${type}`;
  el.innerHTML=`<span>${ic}</span><span>${msg}</span>`;
  document.getElementById('tc').appendChild(el);
  setTimeout(()=>{el.style.animation='tOut .3s ease forwards';setTimeout(()=>el.remove(),300);},2800);
}

// ═══ SIDEBAR ══════════════════════════════════════════════
function toggleSB(){
  sbCol=!sbCol;
  document.getElementById('sb').classList.toggle('col',sbCol);
  document.getElementById('mn').classList.toggle('col',sbCol);
  document.getElementById('colico').innerHTML=sbCol
    ?'<path d="M13 5l7 7-7 7M6 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    :'<path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
}

// ═══ ROUTER ═══════════════════════════════════════════════
function nav(p){
  curP=p;
  Object.keys(CH).forEach(k=>{try{CH[k].destroy();}catch(e){}});
  CH={};
  document.querySelectorAll('.ni').forEach(el=>el.classList.toggle('active',el.dataset.p===p));
  const pages={dashboard:pgDash,tasks:pgTasks,calendar:pgCal,projects:pgProj,team:pgTeam,reports:pgRep,settings:pgSet};
  document.getElementById('pw').innerHTML='';
  (pages[p]||pgDash)();
  if(typeof updateNotifs === 'function') updateNotifs();
}

function updateUser(){
  document.getElementById('uav').textContent=inits(S.settings.name);
  document.getElementById('unm').textContent=S.settings.name;
  document.getElementById('url').textContent=S.settings.role;
}

function updateNotifs() {
  const nlist = document.getElementById('nlist');
  const ndot = document.getElementById('ndot');
  if(!nlist || !ndot) return;
  
  const now = new Date();
  now.setHours(0,0,0,0);
  const in3Days = new Date(now);
  in3Days.setDate(in3Days.getDate() + 3);
  
  const upcoming = S.tasks.filter(t => {
    if(t.status === 'done') return false;
    if(!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d <= in3Days;
  }).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  if(upcoming.length > 0) {
    ndot.style.display = 'block';
    nlist.innerHTML = upcoming.map(t => {
      const d = new Date(t.dueDate);
      const isO = d < now;
      return `<div style="padding:10px; background:#f9fafb; border-radius:8px; border-left:3px solid ${isO ? '#ef4444' : '#f59e0b'}; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'" onclick="nav('tasks'); document.getElementById('nmenu').style.display='none';">
        <div style="font-size:13px; font-weight:600; color:#1f2937;">${esc(t.name)}</div>
        <div style="font-size:11px; color:#6b7280; margin-top:4px;">${isO ? 'Overdue!' : 'Due soon:'} ${fmtDs(t.dueDate)}</div>
      </div>`;
    }).join('');
  } else {
    ndot.style.display = 'none';
    nlist.innerHTML = `<div style="font-size:12px; color:#9ca3af; text-align:center; padding:10px;">No upcoming deadlines</div>`;
  }
}

window.toggleNotif = function() {
  const nm = document.getElementById('nmenu');
  if(nm) nm.style.display = nm.style.display === 'none' ? 'block' : 'none';
}

function onGSearch(v){if(!v){tSearch='';}}

// ═══ DASHBOARD ════════════════════════════════════════════
function pgDash(){
  const now=new Date(),hr=now.getHours();
  const gr=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  const tot=S.tasks.length,dn=S.tasks.filter(t=>t.status==='done').length,
        ip=S.tasks.filter(t=>t.status==='inprogress').length,ov=S.tasks.filter(isOver).length;
  const pct=tot?Math.round(dn/tot*100):0;

  document.getElementById('pw').innerHTML=`
  <div class="dlayout">
    <div class="dleft">
      <div class="phdr">
        <div><h1 class="ptitle">${gr}, ${esc(S.settings.name.split(' ')[0])}! 👋</h1><p class="psub">Here's what's happening with your tasks today.</p></div>
        <button class="btn1" onclick="openModal('task')">${ico('+')} New Task</button>
      </div>
      <div class="sgrid">
        <div class="sc"><div class="sic ibl">📋</div><div><div class="slb">Total Tasks</div><div class="sv">${tot}</div><div class="str tfl">${tot===0?'No tasks yet':'All tasks'}</div></div></div>
        <div class="sc"><div class="sic igr">✅</div><div><div class="slb">Completed</div><div class="sv">${dn}</div><div class="str tup">${pct}% completion</div></div></div>
        <div class="sc"><div class="sic ior">⏳</div><div><div class="slb">In Progress</div><div class="sv">${ip}</div><div class="str tfl">${ip} active</div></div></div>
        <div class="sc"><div class="sic ird">🚩</div><div><div class="slb">Overdue</div><div class="sv" style="${ov>0?'color:var(--rd)':''}">${ov}</div><div class="str ${ov>0?'tdn':'tfl'}">${ov>0?ov+' overdue':'All on track'}</div></div></div>
      </div>
      <div class="card cp">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div style="font-size:15px;font-weight:700;color:var(--g800)">Recent Tasks</div>
          <button class="btn2" onclick="nav('tasks')" style="font-size:12px;padding:6px 12px">View all</button>
        </div>
        ${recentTasksHTML()}
      </div>
      <div class="chrow">
        <div class="chtcard">
          <div class="chthdr"><div class="chttl">Tasks Overview</div><select class="wks" id="wksel" onchange="buildLine()"><option value="week">This Week</option><option value="month">This Month</option></select></div>
          <canvas id="lc" height="140"></canvas>
          <div class="chttl" style="margin-top:45px;margin-bottom:10px;font-size:13px;color:var(--g600);">Pending Risks / Priorities</div>
          <canvas id="rc" height="130"></canvas>
        </div>
        <div class="chtcard">
          <div class="chthdr"><div class="chttl">By Priority</div></div>
          <div style="display:flex;justify-content:center"><canvas id="dc" height="150"></canvas></div>
          <div class="dnleg" id="dleg"></div>
        </div>
      </div>
    </div>
    <div class="dright">
      <div class="card cp">
        <div style="font-size:14px;font-weight:700;color:var(--g800);margin-bottom:14px">Calendar</div>
        <div class="mcalh"><div class="mcalm" id="mcm"></div><div class="mnav"><button onclick="mcNav(-1)">&#8249;</button><button onclick="mcNav(1)">&#8250;</button></div></div>
        <div class="mcg" id="mcg"></div>
      </div>
      <div class="card cp">
        <div style="font-size:14px;font-weight:700;color:var(--g800);margin-bottom:14px">Progress</div>
        <div class="pgwrap"><div class="pgrow"><div class="pglb">Overall Progress</div><div class="pgpc">${pct}%</div></div><div class="pgbar"><div class="pgfil" style="width:${pct}%"></div></div><div class="pgsub">${dn} of ${tot} tasks completed</div></div>
      </div>
      <div class="card cp">
        <div style="font-size:14px;font-weight:700;color:var(--g800);margin-bottom:14px">Upcoming Tasks</div>
        ${upcomingHTML()}
        <button class="btn2" style="width:100%;justify-content:center;margin-top:10px" onclick="nav('tasks')">View all tasks →</button>
      </div>
    </div>
  </div>`;
  renderMiniCal();
  setTimeout(()=>{buildLine();buildDonut('dc','dleg');buildRisk();},60);
}

function buildRisk(){
  if(CH.risk){try{CH.risk.destroy();}catch(e){}}
  const h=S.tasks.filter(t=>t.status!=='done'&&t.prio==='High').length;
  const m=S.tasks.filter(t=>t.status!=='done'&&t.prio==='Medium').length;
  const l=S.tasks.filter(t=>t.status!=='done'&&t.prio==='Low').length;
  const canvas=document.getElementById('rc');if(!canvas)return;
  CH.risk=new Chart(canvas.getContext('2d'),{
    type:'bar',
    data:{
      labels:['High risk','Medium risk','Low risk'],
      datasets:[{
        data:[h,m,l],
        backgroundColor:['#ef4444','#f59e0b','#10b981'],
        borderWidth:0,
        borderRadius:4,
        barPercentage:0.4
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:true,
      plugins:{legend:{display:false}},
      scales:{
        x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'}},
        y:{grid:{color:'#e5e7eb',drawBorder:false},ticks:{font:{size:11},color:'#9ca3af',stepSize:1},beginAtZero:true}
      }
    }
  });
}

function recentTasksHTML(){
  const list=S.tasks.slice().sort((a,b)=>b.id-a.id).slice(0,5);
  if(!list.length)return`<div class="es" style="padding:30px 0"><div class="es-ic">📭</div><div class="es-tt">No tasks yet</div><div class="es-ds">Click "New Task" to get started</div></div>`;
  return`<div class="twrap"><table class="tt"><thead><tr><th style="width:24px"></th><th>Task</th><th>Category</th><th>Due Date</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${list.map(t=>{const si=sInfo(t),done=t.status==='done';return`<tr class="${isOver(t)?'overdue-row':''}"><td><div class="chk ${done?'dn':''}" onclick="toggleT(${t.id})">${ckSVG()}</div></td><td><span class="tnm ${done?'dk':''}">${esc(t.name)}</span></td><td><span class="tag ${tc(t.cat)}">${esc(t.cat)}</span></td><td style="font-size:12px;color:${isOver(t)?'var(--rd)':'var(--g400)'}">${fmtDs(t.dueDate)}</td><td><span class="bd ${pc(t.prio)}">${t.prio}</span></td><td><span class="sbd ${si.c}">${si.l}</span></td><td><div style="display:flex;gap:2px"><div class="abtn" onclick="openModal('task',${t.id})" title="Edit">${editSVG()}</div><div class="abtn dl" onclick="delT(${t.id})" title="Delete">${trashSVG()}</div></div></td></tr>`;}).join('')}</tbody></table></div>`;
}

function upcomingHTML(){
  const list=S.tasks.filter(t=>t.status!=='done'&&t.dueDate).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).slice(0,4);
  if(!list.length)return`<div style="color:var(--g400);font-size:12.5px;text-align:center;padding:16px 0">No upcoming tasks</div>`;
  return list.map(t=>`<div class="upi"><div class="upth" style="background:${CBGS[t.cat]||'#f3f4f6'}">${CICS[t.cat]||'📌'}</div><div style="flex:1"><div class="upnm">${esc(t.name)}</div><div class="updt" style="color:${isOver(t)?'var(--rd)':'var(--g400)'}">${fmtDs(t.dueDate)}</div></div><span class="bd ${pc(t.prio)}" style="font-size:10px;padding:3px 8px">${t.prio}</span></div>`).join('');
}

// ═══ MINI CALENDAR ════════════════════════════════════════
function mcNav(d){mc.m+=d;if(mc.m>11){mc.m=0;mc.y++;}if(mc.m<0){mc.m=11;mc.y--;}renderMiniCal();}
function renderMiniCal(){
  const el=document.getElementById('mcg');if(!el)return;
  document.getElementById('mcm').textContent=MONTHS_LG[mc.m]+' '+mc.y;
  const tds=new Set(S.tasks.map(t=>t.dueDate));
  const todS=new Date().toISOString().split('T')[0];
  const first=new Date(mc.y,mc.m,1).getDay(),dim=new Date(mc.y,mc.m+1,0).getDate(),prev=new Date(mc.y,mc.m,0).getDate(),off=first===0?6:first-1;
  let h=['Mo','Tu','We','Th','Fr','Sa','Su'].map(d=>`<div class="mcdn">${d}</div>`).join('');
  for(let i=off;i>0;i--)h+=`<div class="mcd om">${prev-i+1}</div>`;
  for(let d=1;d<=dim;d++){const ds=`${mc.y}-${String(mc.m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,isT=ds===todS,hasT=tds.has(ds);h+=`<div class="mcd ${isT?'td':''} ${hasT?'ht':''}">${d}</div>`;}
  const rem=42-off-dim;for(let d=1;d<=rem;d++)h+=`<div class="mcd om">${d}</div>`;
  el.innerHTML=h;
}

// ═══ DASHBOARD CHARTS ═════════════════════════════════════
function buildLine(){
  if(CH.line){try{CH.line.destroy();}catch(e){}}
  const mode=document.getElementById('wksel')?.value||'week';
  const now=new Date();let labels=[],c1=[],c2=[];
  if(mode==='week'){
    for(let i=0;i<7;i++){const d=new Date(now);d.setDate(now.getDate()-now.getDay()+i+1);const ds=d.toISOString().split('T')[0];labels.push(['Mo','Tu','We','Th','Fr','Sa','Su'][i]);c1.push(S.tasks.filter(t=>t.dueDate===ds).length);c2.push(S.tasks.filter(t=>t.status==='done'&&t.dueDate===ds).length);}
  }else{for(let i=1;i<=4;i++){labels.push('Wk'+i);c1.push(Math.floor(S.tasks.length/4));c2.push(Math.floor(S.tasks.filter(t=>t.status==='done').length/4));}}
  const canvas=document.getElementById('lc');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const g1=ctx.createLinearGradient(0,0,0,140);g1.addColorStop(0,'rgba(124,58,237,.15)');g1.addColorStop(1,'rgba(124,58,237,0)');
  const g2=ctx.createLinearGradient(0,0,0,140);g2.addColorStop(0,'rgba(16,185,129,.12)');g2.addColorStop(1,'rgba(16,185,129,0)');
  CH.line=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Tasks',data:c1,borderColor:'#7c3aed',backgroundColor:g1,tension:.4,fill:true,pointBackgroundColor:'#7c3aed',pointRadius:4,borderWidth:2.5},{label:'Done',data:c2,borderColor:'#10b981',backgroundColor:g2,tension:.4,fill:true,pointBackgroundColor:'#10b981',pointRadius:4,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'}},y:{grid:{color:'#f3f4f6'},ticks:{font:{size:11},color:'#9ca3af',stepSize:1},beginAtZero:true,min:0}}}});
}

function buildDonut(cid,lid){
  if(CH.donut){try{CH.donut.destroy();}catch(e){}}
  const h=S.tasks.filter(t=>t.prio==='High').length,m=S.tasks.filter(t=>t.prio==='Medium').length,l=S.tasks.filter(t=>t.prio==='Low').length,tot=S.tasks.length||1;
  const el=document.getElementById(lid);
  if(el)el.innerHTML=[{lb:'High',n:h,c:'#ef4444'},{lb:'Medium',n:m,c:'#f59e0b'},{lb:'Low',n:l,c:'#10b981'}].map(x=>`<div class="dnrow"><div class="dnl"><div class="dndot" style="background:${x.c}"></div>${x.lb}</div><div class="dnn">${x.n} (${Math.round(x.n/tot*100)}%)</div></div>`).join('');
  const canvas=document.getElementById(cid);if(!canvas)return;
  CH.donut=new Chart(canvas.getContext('2d'),{type:'doughnut',data:{labels:['High','Medium','Low'],datasets:[{data:[h||.01,m||.01,l||.01],backgroundColor:['#ef4444','#f59e0b','#10b981'],borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:true,cutout:'65%',plugins:{legend:{display:false}}}});
}

// ═══ TASKS PAGE ═══════════════════════════════════════════
function pgTasks(){
  document.getElementById('pw').innerHTML=`
  <div class="phdr"><div><h1 class="ptitle">Tasks</h1><p class="psub">Manage and track all your tasks</p></div><button class="btn1" onclick="openModal('task')">${ico('+')} New Task</button></div>
  <div class="card cp">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <div class="tabbar" id="ttabs">
        ${['all','todo','inprogress','done','overdue'].map(t=>`<div class="tab ${tTab===t?'act':''}" onclick="setTTab('${t}')">${{all:'All',todo:'To Do',inprogress:'In Progress',done:'Done',overdue:'Overdue'}[t]}</div>`).join('')}
      </div>
      <div class="fbar" style="margin-bottom:0">
        <input class="finp" style="width:180px" placeholder="Search…" value="${esc(tSearch)}" oninput="tSearch=this.value;renderTT()" />
        <select class="fsel" onchange="tFilt.prio=this.value;renderTT()">
          <option value="all">All Priorities</option>${PRIOS.map(p=>`<option value="${p}" ${tFilt.prio===p?'selected':''}>${p}</option>`).join('')}
        </select>
        <select class="fsel" onchange="tFilt.cat=this.value;renderTT()">
          <option value="all">All Categories</option>${CATS.map(c=>`<option value="${c}" ${tFilt.cat===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="ttcont">${taskTableHTML()}</div>
  </div>`;
}

function setTTab(t){tTab=t;document.querySelectorAll('#ttabs .tab').forEach(el=>el.classList.toggle('act',el.textContent.toLowerCase().replace(' ','')===t.replace(' ','')));renderTT();}
function renderTT(){const el=document.getElementById('ttcont');if(el)el.innerHTML=taskTableHTML();}

function filteredTasks(){
  let l=S.tasks.slice();
  if(tTab==='todo')l=l.filter(t=>t.status==='todo');
  else if(tTab==='inprogress')l=l.filter(t=>t.status==='inprogress');
  else if(tTab==='done')l=l.filter(t=>t.status==='done');
  else if(tTab==='overdue')l=l.filter(isOver);
  if(tFilt.prio!=='all')l=l.filter(t=>t.prio===tFilt.prio);
  if(tFilt.cat!=='all')l=l.filter(t=>t.cat===tFilt.cat);
  if(tSearch){const q=tSearch.toLowerCase();l=l.filter(t=>t.name.toLowerCase().includes(q)||(t.desc||'').toLowerCase().includes(q)||t.cat.toLowerCase().includes(q));}
  return l;
}

function taskTableHTML(){
  const list=filteredTasks();
  if(!list.length)return`<div class="es"><div class="es-ic">📭</div><div class="es-tt">No tasks found</div><div class="es-ds">${S.tasks.length===0?'Click "New Task" to create your first task':'Try adjusting filters or search'}</div></div>`;
  return`<div class="twrap"><table class="tt"><thead><tr><th style="width:24px"></th><th>Task Name</th><th>Category</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(t=>{const si=sInfo(t),done=t.status==='done';return`<tr class="${isOver(t)?'overdue-row':''}"><td><div class="chk ${done?'dn':''}" onclick="toggleT(${t.id})">${ckSVG()}</div></td><td><div class="tnm ${done?'dk':''}">${esc(t.name)}</div>${t.desc?`<div style="font-size:11.5px;color:var(--g400);margin-top:2px">${esc(t.desc.slice(0,60))}${t.desc.length>60?'…':''}</div>`:''}</td><td><span class="tag ${tc(t.cat)}">${esc(t.cat)}</span></td><td style="font-size:12px;color:${isOver(t)?'var(--rd)':'var(--g400)'}">${fmtDs(t.dueDate)}</td><td><span class="bd ${pc(t.prio)}">${t.prio}</span></td><td><span class="sbd ${si.c}">${si.l}</span></td><td><div style="display:flex;gap:4px"><div class="abtn" onclick="openModal('task',${t.id})">${editSVG()}</div><div class="abtn dl" onclick="delT(${t.id})">${trashSVG()}</div></div></td></tr>`;}).join('')}</tbody></table></div>`;
}

// ═══ CALENDAR PAGE ════════════════════════════════════════
function pgCal(){
  document.getElementById('pw').innerHTML=`
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div><h1 class="ptitle">Calendar</h1><p class="psub">View tasks by date</p></div>
    <div style="display:flex;align-items:center;gap:10px">
      <button style="width:34px;height:34px;border-radius:var(--rsm);background:var(--wh);border:1.5px solid var(--g200);display:flex;align-items:center;justify-content:center;color:var(--g500);cursor:pointer;transition:all .2s;font-size:18px;line-height:1" onclick="fcNav(-1)">‹</button>
      <div id="fcm" style="font-size:18px;font-weight:700;color:var(--g800);min-width:160px;text-align:center"></div>
      <button style="width:34px;height:34px;border-radius:var(--rsm);background:var(--wh);border:1.5px solid var(--g200);display:flex;align-items:center;justify-content:center;color:var(--g500);cursor:pointer;transition:all .2s;font-size:18px;line-height:1" onclick="fcNav(1)">›</button>
      <button class="btn1" onclick="openModal('task')" style="margin-left:8px">${ico('+')} New Task</button>
    </div>
  </div>
  <div class="fullcal">
    <div class="fchead">${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>`<div>${d}</div>`).join('')}</div>
    <div class="fcgrid" id="fcg"></div>
  </div>`;
  renderFullCal();
}

function fcNav(d){fc.m+=d;if(fc.m>11){fc.m=0;fc.y++;}if(fc.m<0){fc.m=11;fc.y--;}renderFullCal();}
function renderFullCal(){
  const el=document.getElementById('fcg');if(!el)return;
  document.getElementById('fcm').textContent=MONTHS_LG[fc.m]+' '+fc.y;
  const todS=new Date().toISOString().split('T')[0];
  const first=new Date(fc.y,fc.m,1).getDay(),dim=new Date(fc.y,fc.m+1,0).getDate(),prev=new Date(fc.y,fc.m,0).getDate(),off=first===0?6:first-1;
  let h='';
  for(let i=off;i>0;i--)h+=`<div class="fcc om"><div class="fdn">${prev-i+1}</div></div>`;
  for(let d=1;d<=dim;d++){
    const ds=`${fc.y}-${String(fc.m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,isT=ds===todS;
    const dayT=S.tasks.filter(t=>t.dueDate===ds);
    const evs=dayT.slice(0,3).map(t=>{const cl=(CEVCOLS[t.cat]||'#f3f4f6:#4b5563').split(':');return`<div class="cev" style="background:${cl[0]};color:${cl[1]}">${esc(t.name)}</div>`;}).join('');
    const more=dayT.length>3?`<div style="font-size:10px;color:var(--g400);padding:1px 4px">+${dayT.length-3} more</div>`:'';
    h+=`<div class="fcc"><div class="fdn ${isT?'td':''}">${d}</div>${evs}${more}</div>`;
  }
  const rem=42-off-dim;for(let d=1;d<=rem;d++)h+=`<div class="fcc om"><div class="fdn">${d}</div></div>`;
  el.innerHTML=h;
}

// ═══ PROJECTS PAGE ════════════════════════════════════════
function pgProj(){
  document.getElementById('pw').innerHTML=`
  <div class="phdr"><div><h1 class="ptitle">Projects</h1><p class="psub">Organize your work into projects</p></div><button class="btn1" onclick="openModal('project')">${ico('+')} New Project</button></div>
  <div class="pjgrid">${projCardsHTML()}</div>`;
}

function projCardsHTML(){
  if(!S.projects.length)return`<div style="grid-column:1/-1"><div class="es"><div class="es-ic">📁</div><div class="es-tt">No projects yet</div><div class="es-ds">Click "New Project" to create your first project</div></div></div>`;
  const smap={active:{c:'sip',l:'Active'},completed:{c:'sdn',l:'Completed'},hold:{c:'std',l:'On Hold'}};
  return S.projects.map(p=>{
    const pt=S.tasks.filter(t=>t.projectId===String(p.id)),dn=pt.filter(t=>t.status==='done').length,pct=pt.length?Math.round(dn/pt.length*100):0,sm=smap[p.status]||{c:'sip',l:'Active'};
    return`<div class="pjcard" style="--pc:${p.color}"><div class="pjnm">${esc(p.name)}</div><div class="pjds">${esc(p.desc||'No description added.')}</div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><span style="font-size:12px;color:var(--g500)">${pt.length} tasks</span><span class="sbd ${sm.c}" style="font-size:10px">${sm.l}</span></div><div class="pjpb"><div class="pjpf" style="width:${pct}%"></div></div><div class="pjft"><div style="font-size:12px;color:var(--g500)">${dn}/${pt.length} done · ${pct}%</div><div style="display:flex;gap:4px"><div class="abtn" onclick="openModal('project',${p.id})">${editSVG()}</div><div class="abtn dl" onclick="delProj(${p.id})">${trashSVG()}</div></div></div></div>`;
  }).join('');
}

// ═══ TEAM PAGE ════════════════════════════════════════════
function pgTeam(){
  document.getElementById('pw').innerHTML=`
  <div class="phdr"><div><h1 class="ptitle">Team</h1><p class="psub">Manage your team members</p></div><button class="btn1" onclick="openModal('member')">${ico('+')} Add Member</button></div>
  <div class="tmgrid">${memberCardsHTML()}</div>`;
}

function memberCardsHTML(){
  if(!S.team.length)return`<div style="grid-column:1/-1"><div class="es"><div class="es-ic">👥</div><div class="es-tt">No team members yet</div><div class="es-ds">Click "Add Member" to add your first team member</div></div></div>`;
  return S.team.map((m,i)=>{
    const tasks=S.tasks.filter(t=>t.assigneeId===String(m.id)),dn=tasks.filter(t=>t.status==='done').length;
    return`<div class="tmcard"><div class="tmav" style="background:${AVCOLS[i%AVCOLS.length]}">${inits(m.name)}</div><div style="font-size:15px;font-weight:700;color:var(--g800);margin-bottom:4px">${esc(m.name)}</div><div style="font-size:12.5px;color:var(--g500);margin-bottom:2px">${esc(m.role)}</div><div style="font-size:11.5px;color:var(--g400);margin-bottom:4px">${esc(m.dept||'')}</div><div style="font-size:12px;color:var(--pu);margin-bottom:10px">${esc(m.email||'')}</div><div style="font-size:12px;color:var(--g500);margin-bottom:14px">${tasks.length} tasks · ${dn} completed</div><div style="display:flex;gap:8px;justify-content:center"><button class="btn2" style="font-size:12px;padding:6px 12px" onclick="openModal('member',${m.id})">Edit</button><button class="btn2" style="font-size:12px;padding:6px 12px;color:var(--rd)" onclick="delMem(${m.id})">Remove</button></div></div>`;
  }).join('');
}

// ═══ REPORTS PAGE ═════════════════════════════════════════
function pgRep(){
  const tot=S.tasks.length,dn=S.tasks.filter(t=>t.status==='done').length,ip=S.tasks.filter(t=>t.status==='inprogress').length,ov=S.tasks.filter(isOver).length,cmp=tot?Math.round(dn/tot*100):0;
  document.getElementById('pw').innerHTML=`
  <div class="phdr"><div><h1 class="ptitle">Reports & Analytics</h1><p class="psub">Insights into your productivity</p></div></div>
  <div class="rsgrid">
    <div class="sc"><div class="sic ibl">📊</div><div><div class="slb">Total Tasks</div><div class="sv">${tot}</div></div></div>
    <div class="sc"><div class="sic igr">✅</div><div><div class="slb">Completion Rate</div><div class="sv">${cmp}%</div></div></div>
    <div class="sc"><div class="sic ior">⏳</div><div><div class="slb">In Progress</div><div class="sv">${ip}</div></div></div>
    <div class="sc"><div class="sic ird">🚩</div><div><div class="slb">Overdue</div><div class="sv">${ov}</div></div></div>
  </div>
  <div class="repgrid">
    <div class="chtcard"><div class="chthdr"><div class="chttl">Tasks by Category</div></div><canvas id="catc" height="200"></canvas></div>
    <div class="chtcard"><div class="chthdr"><div class="chttl">Tasks by Priority</div></div><div style="display:flex;justify-content:center"><canvas id="pric" height="200"></canvas></div><div class="dnleg" id="prileg"></div></div>
    <div class="chtcard"><div class="chthdr"><div class="chttl">Status Overview</div></div><canvas id="stc" height="200"></canvas></div>
    <div class="chtcard"><div class="chthdr"><div class="chttl">Category Summary</div></div>${summaryTableHTML()}</div>
  </div>`;
  setTimeout(buildRepCharts,60);
}

function summaryTableHTML(){
  const cats=CATS.map(c=>({n:c,t:S.tasks.filter(x=>x.cat===c).length,d:S.tasks.filter(x=>x.cat===c&&x.status==='done').length})).filter(c=>c.t>0);
  if(!cats.length)return`<div class="es" style="padding:30px"><div class="es-ic">📊</div><div class="es-tt">No data yet</div><div class="es-ds">Add tasks to see analytics</div></div>`;
  return`<table style="width:100%;border-collapse:collapse"><thead><tr>${['Category','Total','Done','Rate'].map(h=>`<th style="text-align:${h==='Category'?'left':'right'};padding:8px 0;font-size:11px;font-weight:600;color:var(--g500);text-transform:uppercase;border-bottom:1.5px solid var(--g100)">${h}</th>`).join('')}</tr></thead><tbody>${cats.map(c=>`<tr style="border-bottom:1px solid var(--g100)"><td style="padding:8px 0;font-size:13px;color:var(--g700)">${c.n}</td><td style="text-align:right;padding:8px 0;font-size:13px;font-weight:600">${c.t}</td><td style="text-align:right;padding:8px 0;font-size:13px;color:var(--gr)">${c.d}</td><td style="text-align:right;padding:8px 0;font-size:13px;color:var(--pu);font-weight:600">${c.t?Math.round(c.d/c.t*100):0}%</td></tr>`).join('')}</tbody></table>`;
}

function buildRepCharts(){
  // Category bar
  const catEl=document.getElementById('catc');
  if(catEl){const cats=CATS.map(c=>({n:c,v:S.tasks.filter(t=>t.cat===c).length})).filter(c=>c.v>0);CH.cat=new Chart(catEl,{type:'bar',data:{labels:cats.map(c=>c.n),datasets:[{data:cats.map(c=>c.v),backgroundColor:'rgba(124,58,237,0.7)',borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#9ca3af',maxRotation:30}},y:{grid:{color:'#f3f4f6'},ticks:{font:{size:11},color:'#9ca3af',stepSize:1},beginAtZero:true}}}});}
  // Priority donut
  buildDonut('pric','prileg');
  CH.donut&&(CH.repDonut=CH.donut,delete CH.donut);
  // Status bar
  const stEl=document.getElementById('stc');
  if(stEl){const td=S.tasks.filter(t=>t.status==='todo').length,ip=S.tasks.filter(t=>t.status==='inprogress').length,dn=S.tasks.filter(t=>t.status==='done').length,ov=S.tasks.filter(isOver).length;CH.st=new Chart(stEl,{type:'bar',data:{labels:['To Do','In Progress','Done','Overdue'],datasets:[{data:[td,ip,dn,ov],backgroundColor:['#9ca3af','#3b82f6','#10b981','#ef4444'],borderRadius:8,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'}},y:{grid:{color:'#f3f4f6'},ticks:{font:{size:11},color:'#9ca3af',stepSize:1},beginAtZero:true}}}});}
}

// ═══ SETTINGS PAGE ════════════════════════════════════════
function pgSet(){
  document.getElementById('pw').innerHTML=`
  <div class="phdr"><div><h1 class="ptitle">Settings</h1><p class="psub">Customize your Plannr experience</p></div><button class="btn1" onclick="saveSet()">Save Changes</button></div>
  <div class="setlayout">
    <div class="card cp">
      <div class="settt">Profile</div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;padding:16px;background:var(--g50);border-radius:var(--rmd)">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--pu),var(--pul));display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:700;flex-shrink:0">${inits(S.settings.name)}</div>
        <div><div style="font-size:15px;font-weight:700;color:var(--g800)">${esc(S.settings.name)}</div><div style="font-size:13px;color:var(--g500)">${esc(S.settings.role)}</div><div style="font-size:12px;color:var(--g400)">${esc(S.settings.email||'—')}</div></div>
      </div>
      <div class="fg"><label class="fl">Full Name</label><input class="fi" id="sn" value="${esc(S.settings.name)}" placeholder="Your full name"/></div>
      <div class="fg"><label class="fl">Role / Title</label><input class="fi" id="sr" value="${esc(S.settings.role)}" placeholder="e.g. Product Designer"/></div>
      <div class="fg"><label class="fl">Email</label><input class="fi" type="email" id="se" value="${esc(S.settings.email||'')}" placeholder="your@email.com"/></div>
    </div>
    <div>
      <div class="card cp" style="margin-bottom:16px">
        <div class="settt">Notifications</div>
        <div class="togwrap"><div class="togi"><div class="tt">Email Notifications</div><div class="ds">Receive task reminders via email</div></div><div class="tog ${S.settings.notif?'on':''}" onclick="togSet('notif',this)"></div></div>
        <div class="togwrap"><div class="togi"><div class="tt">Due Date Reminders</div><div class="ds">Get notified before tasks are due</div></div><div class="tog ${S.settings.remind?'on':''}" onclick="togSet('remind',this)"></div></div>
        <div class="togwrap" style="border:none"><div class="togi"><div class="tt">Weekly Summary</div><div class="ds">Receive weekly productivity reports</div></div><div class="tog ${S.settings.weekly?'on':''}" onclick="togSet('weekly',this)"></div></div>
      </div>
      <div class="card cp">
        <div class="settt">Data Management</div>
        <p style="font-size:13px;color:var(--g500);margin-bottom:16px;line-height:1.5">Manage your app data. This action cannot be undone.</p>
        <button class="btn2" style="width:100%;justify-content:center;color:var(--rd);border-color:var(--rdp);background:var(--rdp)" onclick="clearData()">🗑️ Clear All Data</button>
      </div>
    </div>
  </div>`;
}

function togSet(key,el){S.settings[key]=!S.settings[key];el.classList.toggle('on',S.settings[key]);}
function saveSet(){
  S.settings.name=document.getElementById('sn').value.trim()||S.settings.name;
  S.settings.role=document.getElementById('sr').value.trim()||S.settings.role;
  S.settings.email=document.getElementById('se').value.trim();
  save();updateUser();pgSet();toast('Settings saved!','ok');
}
function clearData(){if(!confirm('Delete ALL tasks, projects and team data? This cannot be undone.'))return;S.tasks=[];S.projects=[];S.team=[];save();nav(curP);toast('All data cleared','warn');}

// ═══ MODAL SYSTEM ═════════════════════════════════════════
function openModal(type,id=null){
  mtype=type;eid=id;
  document.getElementById('mo').classList.add('show');
  document.getElementById('mc').innerHTML=buildModal(type,id);
}
function closeModal(){document.getElementById('mo').classList.remove('show');}

function buildModal(type,id){
  if(type==='task')return taskModal(id);
  if(type==='project')return projModal(id);
  if(type==='member')return memModal(id);
  return'';
}

function taskModal(id){
  const t=id?S.tasks.find(x=>x.id===id):null;
  const today=new Date().toISOString().split('T')[0];
  return`<div class="mhdr"><div class="mtl">${t?'Edit Task':'New Task'}</div><div class="mcl" onclick="closeModal()">×</div></div>
  <form onsubmit="submitTask(event)">
    <div class="fg"><label class="fl">Task Name *</label><input class="fi" id="mtn" value="${esc(t?.name||'')}" placeholder="Enter task name…" required maxlength="100"/></div>
    <div class="fg"><label class="fl">Description</label><textarea class="fta" id="md" placeholder="Add a description…">${esc(t?.desc||'')}</textarea></div>
    <div class="fg2">
      <div class="fg"><label class="fl">Category *</label><select class="fs" id="mcat">${CATS.map(c=>`<option value="${c}" ${(t?.cat||CATS[0])===c?'selected':''}>${c}</option>`).join('')}</select></div>
      <div class="fg"><label class="fl">Priority *</label><select class="fs" id="mpr">${PRIOS.map(p=>`<option value="${p}" ${(t?.prio||'Medium')===p?'selected':''}>${p}</option>`).join('')}</select></div>
      <div class="fg"><label class="fl">Due Date *</label><input class="fi" type="date" id="mdt" value="${t?.dueDate||today}" required/></div>
      <div class="fg"><label class="fl">Status</label><select class="fs" id="mst"><option value="todo" ${(t?.status||'todo')==='todo'?'selected':''}>To Do</option><option value="inprogress" ${t?.status==='inprogress'?'selected':''}>In Progress</option><option value="done" ${t?.status==='done'?'selected':''}>Done</option></select></div>
      ${S.projects.length?`<div class="fg" style="grid-column:1/-1"><label class="fl">Project</label><select class="fs" id="mpj"><option value="">No Project</option>${S.projects.map(p=>`<option value="${p.id}" ${t?.projectId===String(p.id)?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>`:''}
      ${S.team.length?`<div class="fg" style="grid-column:1/-1"><label class="fl">Assignee</label><select class="fs" id="mas"><option value="">Unassigned</option>${S.team.map(m=>`<option value="${m.id}" ${t?.assigneeId===String(m.id)?'selected':''}>${esc(m.name)}</option>`).join('')}</select></div>`:''}
    </div>
    <div class="mft"><button type="button" class="btncan" onclick="closeModal()">Cancel</button><button type="submit" class="btnsv">${t?'Save Changes':'Create Task'}</button></div>
  </form>`;
}

function projModal(id){
  const p=id?S.projects.find(x=>x.id===id):null;
  pCol=p?.color||PCOLORS[0];
  return`<div class="mhdr"><div class="mtl">${p?'Edit Project':'New Project'}</div><div class="mcl" onclick="closeModal()">×</div></div>
  <form onsubmit="submitProj(event)">
    <div class="fg"><label class="fl">Project Name *</label><input class="fi" id="pjn" value="${esc(p?.name||'')}" placeholder="Enter project name…" required maxlength="80"/></div>
    <div class="fg"><label class="fl">Description</label><textarea class="fta" id="pjd" placeholder="What is this project about?">${esc(p?.desc||'')}</textarea></div>
    <div class="fg2">
      <div class="fg"><label class="fl">Status</label><select class="fs" id="pjs"><option value="active" ${(p?.status||'active')==='active'?'selected':''}>Active</option><option value="completed" ${p?.status==='completed'?'selected':''}>Completed</option><option value="hold" ${p?.status==='hold'?'selected':''}>On Hold</option></select></div>
      <div class="fg"><label class="fl">Deadline</label><input class="fi" type="date" id="pjdl" value="${p?.deadline||''}"/></div>
    </div>
    <div class="fg"><label class="fl">Color</label><div class="colops">${PCOLORS.map(c=>`<div class="colop ${c===pCol?'sel':''}" style="background:${c}" onclick="pickC('${c}',this)"></div>`).join('')}</div></div>
    <div class="mft"><button type="button" class="btncan" onclick="closeModal()">Cancel</button><button type="submit" class="btnsv">${p?'Save Changes':'Create Project'}</button></div>
  </form>`;
}

function memModal(id){
  const m=id?S.team.find(x=>x.id===id):null;
  return`<div class="mhdr"><div class="mtl">${m?'Edit Member':'Add Member'}</div><div class="mcl" onclick="closeModal()">×</div></div>
  <form onsubmit="submitMem(event)">
    <div class="fg"><label class="fl">Full Name *</label><input class="fi" id="mmn" value="${esc(m?.name||'')}" placeholder="Full name…" required maxlength="60"/></div>
    <div class="fg2">
      <div class="fg"><label class="fl">Role / Title *</label><input class="fi" id="mmr" value="${esc(m?.role||'')}" placeholder="e.g. Developer" required/></div>
      <div class="fg"><label class="fl">Department</label><select class="fs" id="mmd"><option value="">Select…</option>${DEPTS.map(d=>`<option value="${d}" ${m?.dept===d?'selected':''}>${d}</option>`).join('')}</select></div>
      <div class="fg" style="grid-column:1/-1"><label class="fl">Email</label><input class="fi" type="email" id="mme" value="${esc(m?.email||'')}" placeholder="email@example.com"/></div>
    </div>
    <div class="mft"><button type="button" class="btncan" onclick="closeModal()">Cancel</button><button type="submit" class="btnsv">${m?'Save Changes':'Add Member'}</button></div>
  </form>`;
}

function pickC(c,el){pCol=c;document.querySelectorAll('.colop').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');}

// ═══ FORM SUBMIT ══════════════════════════════════════════
function submitTask(e){
  e.preventDefault();
  const mtn = document.getElementById('mtn');
  if (!mtn || !mtn.value.trim()) return;
  const md = document.getElementById('md');
  const mpj = document.getElementById('mpj');
  const mas = document.getElementById('mas');
  
  const data = {
    id: eid || uid(),
    name: mtn.value.trim(),
    desc: md ? md.value.trim() : '',
    cat: document.getElementById('mcat').value,
    prio: document.getElementById('mpr').value,
    dueDate: document.getElementById('mdt').value,
    status: document.getElementById('mst').value,
    projectId: mpj ? mpj.value : null,
    assigneeId: mas ? mas.value : null
  };
  
  if(eid){
    const i = S.tasks.findIndex(t => t.id === eid);
    if(i > -1) S.tasks[i] = data;
    toast('Task updated!','ok');
  } else {
    S.tasks.push(data);
    toast('Task created!','ok');
  }
  save();
  closeModal();
  nav(curP);
}

function submitProj(e){
  e.preventDefault();
  const data={id:eid||uid(),name:document.getElementById('pjn').value.trim(),desc:document.getElementById('pjd')?.value.trim()||'',status:document.getElementById('pjs').value,deadline:document.getElementById('pjdl')?.value||'',color:pCol};
  if(eid){const i=S.projects.findIndex(p=>p.id===eid);if(i>-1)S.projects[i]=data;toast('Project updated!','ok');}
  else{S.projects.push(data);toast('Project created!','ok');}
  save();closeModal();nav(curP);
}

function submitMem(e){
  e.preventDefault();
  const data={id:eid||uid(),name:document.getElementById('mmn').value.trim(),role:document.getElementById('mmr').value.trim(),dept:document.getElementById('mmd')?.value||'',email:document.getElementById('mme')?.value.trim()||''};
  if(eid){const i=S.team.findIndex(m=>m.id===eid);if(i>-1)S.team[i]=data;toast('Member updated!','ok');}
  else{S.team.push(data);toast('Member added!','ok');}
  save();closeModal();nav(curP);
}

// ═══ CRUD ═════════════════════════════════════════════════
function toggleT(id){const t=S.tasks.find(x=>x.id===id);if(!t)return;t.status=t.status==='done'?'todo':'done';save();nav(curP);toast(t.status==='done'?'Task completed! ✨':'Task reopened',t.status==='done'?'ok':'info');}
function delT(id){if(!confirm('Delete this task?'))return;S.tasks=S.tasks.filter(t=>t.id!==id);save();nav(curP);toast('Task deleted','warn');}
function delProj(id){if(!confirm('Delete this project?'))return;S.projects=S.projects.filter(p=>p.id!==id);save();nav(curP);toast('Project deleted','warn');}
function delMem(id){if(!confirm('Remove this team member?'))return;S.team=S.team.filter(m=>m.id!==id);save();nav(curP);toast('Member removed','warn');}

// ═══ ICONS ════════════════════════════════════════════════
function ico(ch){return`<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path d="${ch==='+'?'M12 5v14M5 12h14':''}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function ckSVG(){return`<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function editSVG(){return`<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function trashSVG(){return`<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}

// ═══ INIT ═════════════════════════════════════════════════
load();
const _now=new Date();
mc.y=_now.getFullYear();mc.m=_now.getMonth();
fc.y=_now.getFullYear();fc.m=_now.getMonth();
updateUser();
nav('dashboard');

