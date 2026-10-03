const API="/api";
const state={anime:[],characters:[],trailers:[],gallery:[],filter:"all",visible:8};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
const img=(url,seed)=>url||("https://images.unsplash.com/photo-"+seed+"?auto=format&fit=crop&w=900&q=82");
const getFavs=()=>JSON.parse(localStorage.getItem("animeverse:favs")||"[]");
const setFavs=f=>{localStorage.setItem("animeverse:favs",JSON.stringify(f));updateFavCount()};
function skeletons(){return Array.from({length:8},()=>'<div class="skeleton skeleton-card"></div>').join("")}
function errorState(target,message="The universe is taking a moment to load."){target.innerHTML='<div class="error-state"><strong>Something interrupted the journey.</strong><p>'+esc(message)+'</p><button class="ghost" onclick="load()">Try again</button></div>'}
async function load(q="",type=state.filter){
  $("#animeGrid").innerHTML=skeletons(); $("#characterGrid").innerHTML=skeletons().slice(0,500); 
  try{
    const r=await fetch(API+"/content?q="+encodeURIComponent(q)+"&type="+encodeURIComponent(type),{headers:{"Accept":"application/json"}});
    if(!r.ok)throw new Error("HTTP "+r.status);
    const d=await r.json(); Object.assign(state,d,{filter:type,visible:8}); render();
  }catch(e){errorState($("#animeGrid"),"Check the API/database connection and try again.");$("#characterGrid").innerHTML="";$("#trailerGrid").innerHTML="";$("#galleryGrid").innerHTML=""}
}
function render(){renderAnime();renderCharacters();renderTrailers();renderGallery();updateFavCount();updateStats()}
function renderAnime(){
  const items=state.anime.slice(0,state.visible), favs=getFavs();
  $("#animeGrid").innerHTML=items.length?items.map((a,i)=>'<article class="anime-card" style="animation-delay:'+Math.min(i*35,280)+'ms" onclick="openAnime(\''+esc(a.id)+'\')"><div class="poster"><button class="heart '+(favs.includes(a.id)?"saved":"")+'" aria-label="Favorite '+esc(a.title)+'" onclick="event.stopPropagation();toggleFav(\''+esc(a.id)+'\')">'+(favs.includes(a.id)?"♥":"♡")+'</button><img loading="'+(i<4?"eager":"lazy")+'" src="'+img(a.poster,"1518709268805-4e9042af9f23")+'" alt="'+esc(a.title)+'"><div class="shade"></div></div><div class="card-info"><strong>'+esc(a.title)+'</strong><span>'+esc(a.year)+" · "+esc(a.kind)+" · "+esc(a.genres)+'</span></div></article>').join(""):'<div class="error-state">No worlds match that filter yet.</div>';
  $("#loadMoreBtn").classList.toggle("hidden",state.visible>=state.anime.length);
}
function renderCharacters(){const items=state.characters.slice(0,5);$("#characterGrid").innerHTML=items.length?items.map(c=>'<article class="character" onclick="openCharacter(\''+esc(c.id)+'\')"><img loading="lazy" class="character-img" src="'+img(c.image,"1544005313-94ddf0286df2")+'" alt="'+esc(c.name)+'"><strong>'+esc(c.name)+'</strong><span>'+esc(c.role)+'</span></article>').join(""):"<p>No characters published yet.</p>"}
function renderTrailers(){const items=state.trailers.slice(0,6);$("#trailerGrid").innerHTML=items.length?items.map(t=>'<article class="trailer"><div class="trailer-thumb" onclick="openTrailer(\''+esc(t.id)+'\')" role="button" tabindex="0" aria-label="Play '+esc(t.title)+'">▶</div><div><small>TRAILER</small><h3>'+esc(t.title)+'</h3><p>'+esc(t.description)+'</p></div></article>').join(""):"<p>No trailers published yet.</p>"}
function renderGallery(){const items=state.gallery.slice(0,8);$("#galleryGrid").innerHTML=items.length?items.map(g=>'<img loading="lazy" src="'+img(g.image,"1500534623283-312aade485b7")+'" alt="'+esc(g.title)+'" title="'+esc(g.title)+'" onclick="openGallery(\''+esc(g.id)+'\')">').join(""):"<p>No gallery items published yet.</p>"}
function updateFavCount(){const n=getFavs().length;$("#favCount").textContent=n;$("#collectionCount").textContent=n}
function updateStats(){$("#heroAnimeCount").textContent=state.anime.length;$("#heroCharacterCount").textContent=state.characters.length;$("#heroGalleryCount").textContent=state.gallery.length}
function toggleFav(id){let f=getFavs();const saved=!f.includes(id);f=saved?[...f,id]:f.filter(x=>x!==id);setFavs(f);renderAnime();toast(saved?"Added to your collection":"Removed from your collection");try{fetch(API+"/favorites",{method:saved?"POST":"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({content_type:"anime",content_id:id})})}catch{}}
function openAnime(id){const a=state.anime.find(x=>x.id===id);if(!a)return;const saved=getFavs().includes(id);$("#detailContent").innerHTML='<span class="kicker">'+esc(a.kind)+" · "+esc(a.year)+'</span><h2>'+esc(a.title)+'</h2><p>'+esc(a.description||"A new world awaits.")+'</p><p><b>Genres:</b> '+esc(a.genres||"—")+'</p><button class="primary" onclick="toggleFav(\''+esc(a.id)+'\');openAnime(\''+esc(a.id)+'\')">'+(saved?"♥ Saved to Favorites":"♡ Save to Favorites")+"</button>";$("#detailModal").classList.remove("hidden")}
function openCharacter(id){const c=state.characters.find(x=>x.id===id);if(!c)return;$("#detailContent").innerHTML='<span class="kicker">CHARACTER</span><h2>'+esc(c.name)+'</h2><p><b>'+esc(c.role)+'</b></p><p>'+esc(c.description||"A memorable character in the AnimeVerse.")+"</p>";$("#detailModal").classList.remove("hidden")}
function openTrailer(id){const t=state.trailers.find(x=>x.id===id);if(!t)return;const u=t.youtube_url||"",m=u.match(/[?&]v=([^&]+)/)||u.match(/youtu\.be\/([^?&]+)/)||u.match(/youtube\.com\/embed\/([^?&]+)/),embed=m?"https://www.youtube.com/embed/"+m[1]:"";$("#detailContent").innerHTML='<span class="kicker">TRAILER</span><h2>'+esc(t.title)+'</h2>'+(embed?'<div style="aspect-ratio:16/9"><iframe src="'+esc(embed)+'" style="width:100%;height:100%;border:0;border-radius:16px" allowfullscreen loading="lazy" title="'+esc(t.title)+'"></iframe></div>':'<p>This trailer is available on YouTube.</p><a class="primary" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>')+'<p>'+esc(t.description||"")+"</p>";$("#detailModal").classList.remove("hidden")}
function openGallery(id){const g=state.gallery.find(x=>x.id===id);if(!g)return;$("#detailContent").innerHTML='<img src="'+img(g.image,"1500534623283-312aade485b7")+'" style="width:100%;border-radius:18px" alt="'+esc(g.title)+'"><h2>'+esc(g.title)+'</h2>';$("#detailModal").classList.remove("hidden")}
function openFavorites(){const f=getFavs();$("#searchModal").classList.remove("hidden");$("#searchInput").value="";$("#searchResults").innerHTML=f.length?'<div class="search-hint" style="margin-bottom:8px">YOUR COLLECTION · '+f.length+' saved</div>'+f.map(id=>{const a=state.anime.find(x=>x.id===id);return a?'<div class="result" onclick="openAnime(\''+esc(a.id)+'\')">♥ <b>'+esc(a.title)+'</b><small>'+esc(a.kind)+'</small></div>':""}).join(""):'<p class="section-sub">No favorites yet. Tap ♡ on any world to save it.</p>'}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove("show"),2200)}
function closeModals(){$("#searchModal").classList.add("hidden");$("#detailModal").classList.add("hidden");$("#mobileMenu").classList.add("hidden")}
function openSearch(){$("#searchModal").classList.remove("hidden");$("#searchInput").focus()}
async function search(q){if(!q){$("#searchResults").innerHTML="";return}$("#searchResults").innerHTML='<div class="search-hint">Searching the universe…</div>';try{const r=await fetch(API+"/content?q="+encodeURIComponent(q));const d=await r.json();const rows=[...d.anime.map(a=>'<div class="result" onclick="openAnime(\''+esc(a.id)+'\')">🎬 <b>'+esc(a.title)+'</b><small>Anime</small></div>'),...d.characters.map(c=>'<div class="result" onclick="openCharacter(\''+esc(c.id)+'\')">✦ <b>'+esc(c.name)+'</b><small>Character</small></div>')];$("#searchResults").innerHTML=rows.join("")||'<p class="section-sub">No results. Try another title.</p>'}catch{$("#searchResults").innerHTML='<p class="section-sub">Search is temporarily unavailable.</p>'}}
$("#searchBtn").onclick=openSearch;$("#favNav").onclick=openFavorites;$("#collectionBtn").onclick=openFavorites;$("#closeSearch").onclick=()=>$("#searchModal").classList.add("hidden");$("#closeDetail").onclick=()=>$("#detailModal").classList.add("hidden");
$("#searchInput").oninput=e=>search(e.target.value.trim());
$("#loadMoreBtn").onclick=()=>{state.visible+=8;renderAnime()};
$("#randomBtn").onclick=()=>{if(state.anime.length)openAnime(state.anime[Math.floor(Math.random()*state.anime.length)].id)};
$("#menuBtn").onclick=()=>$("#mobileMenu").classList.toggle("hidden");
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.filter=b.dataset.filter;load("",state.filter)});
document.querySelectorAll(".mobile-menu a").forEach(a=>a.onclick=()=>$("#mobileMenu").classList.add("hidden"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals();if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){e.preventDefault();openSearch()}});
$("#searchModal").addEventListener("click",e=>{if(e.target.id==="searchModal")$("#searchModal").classList.add("hidden")});
$("#detailModal").addEventListener("click",e=>{if(e.target.id==="detailModal")$("#detailModal").classList.add("hidden")});
load();