let kind="anime",data={anime:[],characters:[],trailers:[],gallery:[]};
const $=s=>document.querySelector(s);
const key={anime:"anime",character:"characters",trailer:"trailers",gallery:"gallery"};
const STORE="animeverse:catalog";
const uid=()=>Date.now()+Math.floor(Math.random()*1000);

async function load(){
  try{
    const saved=localStorage.getItem(STORE);
    if(saved){
      data=JSON.parse(saved);
    }else{
      const r=await fetch("/api/content",{headers:{Accept:"application/json"}});
      if(!r.ok) throw new Error("Catalog API unavailable");
      data=await r.json();
      persist();
    }
    $("#auth").classList.add("hidden");
    $("#studio").classList.remove("hidden");
    render();
  }catch(e){
    $("#auth").classList.remove("hidden");
    $("#studio").classList.add("hidden");
    const message=document.querySelector("#loginError");
    if(message) message.textContent="Unable to load the catalog. Please refresh and try again.";
  }
}

function persist(){localStorage.setItem(STORE,JSON.stringify(data))}
function render(){
  const rows=data[key[kind]]||[];
  $("#listTitle").textContent=kind[0].toUpperCase()+kind.slice(1);
  $("#records").innerHTML=rows.map(x=>'<div class="record"><div><b>'+esc(x.title||x.name)+'</b><br><small>'+esc(x.description||x.role||"")+'</small></div><div><button onclick="edit(\''+esc(x.id)+'\')">Edit</button> <button class="danger" onclick="removeItem(\''+esc(x.id)+'\')">Delete</button></div></div>').join("")||"<p>No content yet.</p>";
}
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));

document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  if(b.dataset.kind==="import"){setMode("import");return}
  kind=b.dataset.kind;
  clear();
  render();
});

function clear(){
  $("#editor").reset();
  $("#id").value="";
  $("#published").checked=true;
}

function edit(id){
  const x=(data[key[kind]]||[]).find(v=>String(v.id)===String(id));
  if(!x)return;
  $("#id").value=x.id;
  $("#title").value=x.title||x.name||"";
  $("#subtitle").value=x.subtitle||"";
  $("#description").value=x.description||"";
  $("#year").value=x.year||"";
  $("#genres").value=x.genres||"";
  $("#poster").value=x.poster||"";
  $("#backdrop").value=x.backdrop||"";
  $("#role").value=x.role||"";
  $("#image").value=x.image||"";
  $("#youtube_url").value=x.youtube_url||"";
  $("#anime_kind").value=x.kind||"Movies";
  $("#featured").checked=!!x.featured;
  $("#published").checked=x.published!==false;
  scrollTo({top:0,behavior:"smooth"});
}

function removeItem(id){
  if(!confirm("Delete this content from this device?"))return;
  data[key[kind]]=data[key[kind]].filter(x=>String(x.id)!==String(id));
  persist();
  render();
}

$("#editor").onsubmit=e=>{
  e.preventDefault();
  const id=$("#id").value||uid();
  const b={
    id,title:$("#title").value,name:$("#title").value,
    subtitle:$("#subtitle").value,description:$("#description").value,
    year:$("#year").value,genres:$("#genres").value,
    poster:$("#poster").value,backdrop:$("#backdrop").value,
    role:$("#role").value,image:$("#image").value,
    youtube_url:$("#youtube_url").value,kind:$("#anime_kind").value,
    featured:$("#featured").checked,published:$("#published").checked
  };
  const rows=data[key[kind]]||[];
  const i=rows.findIndex(x=>String(x.id)===String(id));
  if(i>=0)rows[i]={...rows[i],...b};else rows.unshift(b);
  data[key[kind]]=rows;
  persist();
  clear();
  render();
  alert("Saved locally on this device.");
};

$("#reset").onclick=clear;
$("#login").onsubmit=e=>{e.preventDefault();load()};
$("#logout").onclick=()=>location.reload();
load();