const IMPORT_STORE="animeverse:imported-media";
let importItems=[];

function renderImportWorkspace(){
  return `
  <div class="import-hero">
    <div class="dropzone" id="dropzone">
      <div class="drop-icon">✦</div>
      <h2>Import your anime world</h2>
      <p class="hint">Bring artwork from this device, then review smart anime and character matches before saving.</p>
      <input id="mediaPicker" type="file" accept="image/*" multiple hidden>
      <div class="source-actions">
        <button class="primary" type="button" id="deviceImport">📁 From device</button>
        <button class="ghost" type="button" id="googleImport">☁ Google Photos</button>
      </div>
      <div class="import-meta"><span><strong>Device</strong> local-first</span><span><strong>AI</strong> optional</span><span><strong>Review</strong> before save</span></div>
      <div id="importStatus" class="import-status"></div>
    </div>
    <aside class="import-side">
      <span class="kicker">PRIVATE BY DESIGN</span>
      <h3>Your photos stay yours.</h3>
      <p>Device imports are processed in your browser. Nothing is uploaded just to create a gallery item.</p>
      <div class="privacy-list">
        <div><b>✓</b><span>Multiple image selection and drag & drop</span></div>
        <div><b>✓</b><span>Smart catalog matching by filename and metadata</span></div>
        <div><b>✓</b><span>Manual correction before anything is saved</span></div>
        <div><b>○</b><span>Google Photos requires your own OAuth configuration</span></div>
      </div>
      <div class="setup-note"><strong>AI & Google Photos</strong><br>Both integrations are designed as optional server-side connectors. No secret or OAuth token is placed in browser code.</div>
    </aside>
  </div>`;
}

let googleAccessToken=null;
let googlePickerSession=null;
let googlePollTimer=null;

async function loadGoogleIdentity(){
  if(window.google?.accounts?.oauth2)return;
  await new Promise((resolve,reject)=>{
    const existing=document.querySelector("script[data-google-gis]");
    if(existing){existing.addEventListener("load",resolve,{once:true});existing.addEventListener("error",reject,{once:true});return;}
    const script=document.createElement("script");
    script.src="https://accounts.google.com/gsi/client";
    script.async=true;script.defer=true;script.dataset.googleGis="1";
    script.onload=resolve;script.onerror=reject;document.head.appendChild(script);
  });
}

async function getGoogleClientId(){
  const r=await fetch("/api/google-photos-config",{headers:{Accept:"application/json"}});
  if(!r.ok)throw new Error("Google Photos is not configured");
  const d=await r.json();
  if(!d.clientId)throw new Error("GOOGLE_PHOTOS_CLIENT_ID is not configured in Vercel");
  return d.clientId;
}

async function connectGooglePhotos(){
  const popup=window.open("about:blank","animeverse-google-photos","popup,width=480,height=760");
  try{
    setImportStatus("Connecting to Google Photos…");
    const clientId=await getGoogleClientId();
    await loadGoogleIdentity();
    await new Promise((resolve,reject)=>{
      const tokenClient=google.accounts.oauth2.initTokenClient({
        client_id:clientId,
        scope:"https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
        callback:response=>{
          if(response.error){reject(new Error(response.error_description||response.error));return}
          googleAccessToken=response.access_token;resolve();
        }
      });
      tokenClient.requestAccessToken({prompt:"consent"});
    });
    const session=await googlePhotosRequest("/v1/sessions",{method:"POST",body:JSON.stringify({pickingConfig:{maxItemCount:50}})});
    googlePickerSession=session;
    const pickerUri=String(session.pickerUri||"").replace(/\/$/,"")+"/autoclose";
    if(!session.pickerUri)throw new Error("Google Photos did not return a picker URL");
    if(popup&&!popup.closed)popup.location.href=pickerUri;else window.open(pickerUri,"_blank");
    setImportStatus("Google Photos opened. Select your anime artwork there, then return here.","ok");
    waitForGoogleSelection(session.id,session.pollingConfig);
  }catch(error){
    if(popup&&!popup.closed)popup.close();
    setImportStatus(error.message||"Google Photos connection failed.","warn");
  }
}

async function googlePhotosRequest(path,options={}){
  const r=await fetch("https://photospicker.googleapis.com"+path,{
    ...options,
    headers:{
      Accept:"application/json",
      "Content-Type":"application/json",
      Authorization:"Bearer "+googleAccessToken,
      ...(options.headers||{})
    }
  });
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error?.message||"Google Photos request failed");
  return d;
}

function durationMs(value,fallback=3000){
  const m=String(value||"").match(/([0-9.]+)s/);
  return m?Math.max(1000,Number(m[1])*1000):fallback;
}

function waitForGoogleSelection(sessionId,pollingConfig={}){
  clearTimeout(googlePollTimer);
  const started=Date.now(),timeout=durationMs(pollingConfig.timeoutIn,5*60*1000);
  const poll=async()=>{
    if(Date.now()-started>timeout){setImportStatus("Google Photos selection timed out. Start a new import when ready.","warn");return}
    try{
      const session=await googlePhotosRequest("/v1/sessions/"+encodeURIComponent(sessionId));
      if(session.mediaItemsSet){
        const items=await googlePhotosRequest("/v1/mediaItems?sessionId="+encodeURIComponent(sessionId)+"&pageSize=100");
        await addGooglePhotosItems(items.mediaItems||[]);
        try{await googlePhotosRequest("/v1/sessions/"+encodeURIComponent(sessionId),{method:"DELETE"})}catch{}
        return;
      }
      googlePollTimer=setTimeout(poll,durationMs(session.pollingConfig?.pollInterval||pollingConfig.pollInterval,3000));
    }catch(error){setImportStatus(error.message||"Unable to read the Google Photos selection.","warn")}
  };
  poll();
}

async function addGooglePhotosItems(mediaItems){
  if(!mediaItems.length){setImportStatus("No Google Photos items were selected.","warn");return}
  setImportStatus("Importing "+mediaItems.length+" Google Photos item"+(mediaItems.length===1?"":"s")+"…");
  for(const item of mediaItems){
    try{
      const media=item.mediaFile||{},baseUrl=media.baseUrl;
      if(!baseUrl)continue;
      const r=await fetch(baseUrl+"=w1200",{headers:{Authorization:"Bearer "+googleAccessToken}});
      if(!r.ok)continue;
      const blob=await r.blob();
      const ext=(blob.type.split("/")[1]||"jpg").replace("jpeg","jpg");
      const file=new File([blob],(media.filename||"google-photo")+"."+ext,{type:blob.type||"image/jpeg"});
      const image=await resizeImage(file,1200,0.78);
      const match=await smartMatch(media.filename||item.id||"google-photo");
      importItems.push({id:"google-"+item.id,name:media.filename||"Google Photos",image,...match,selected:true,source:"google-photos",googleId:item.id});
    }catch{}
  }
  renderImportResults();
  setImportStatus(importItems.length+" image"+(importItems.length===1?"":"s")+" ready for review.","ok");
}

function initImportWorkspace(){
  importItems=[];
  const zone=document.querySelector("#dropzone"),picker=document.querySelector("#mediaPicker");
  if(!zone||!picker)return;
  $("#deviceImport").onclick=()=>picker.click();
  picker.onchange=e=>addImportFiles([...e.target.files]);
  $("#googleImport").onclick=connectGooglePhotos;
  ["dragenter","dragover"].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.add("drag")}));
  ["dragleave","drop"].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.remove("drag")}));
  zone.addEventListener("drop",e=>addImportFiles([...e.dataTransfer.files].filter(f=>f.type.startsWith("image/"))));
  loadImportedMedia();
}

function loadImportedMedia(){
  try{
    const saved=JSON.parse(localStorage.getItem(IMPORT_STORE)||"[]");
    if(saved.length)setImportStatus(saved.length+" previously imported item"+(saved.length===1?"":"s")+" are already in your local Gallery.","ok");
  }catch{}
}

function setImportStatus(message,tone=""){const el=$("#importStatus");if(el){el.textContent=message;el.className="import-status "+tone}}

async function addImportFiles(files){
  if(!files.length){setImportStatus("Choose one or more image files.","warn");return}
  setImportStatus("Preparing "+files.length+" image"+(files.length===1?"":"s")+"…");
  for(const file of files){
    try{
      const image=await resizeImage(file,1200,0.78);
      const match=await smartMatch(file.name);
      importItems.push({id:"import-"+Date.now()+"-"+Math.random().toString(36).slice(2),name:file.name,image,...match,selected:true});
    }catch{}
  }
  renderImportResults();
  setImportStatus(importItems.length+" image"+(importItems.length===1?"":"s")+" ready for review.","ok");
}

function resizeImage(file,max,quality){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const scale=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL("image/jpeg",quality));
      };
      img.onerror=reject;img.src=reader.result;
    };
    reader.onerror=reject;reader.readAsDataURL(file);
  });
}

async function catalogForMatching(){
  try{
    const saved=localStorage.getItem(STORE);
    if(saved)return JSON.parse(saved);
    const r=await fetch("/api/content",{headers:{Accept:"application/json"}});
    if(r.ok)return r.json();
  }catch{}
  return {anime:[],characters:[]};
}

async function smartMatch(filename){
  const d=await catalogForMatching();
  const clean=s=>String(s||"").toLowerCase().replace(/[_-]+/g," ").replace(/[^a-z0-9 ]/g," ");
  const source=clean(filename);
  const words=source.split(/\s+/).filter(w=>w.length>2);
  const score=x=>{
    const title=clean(x.title||x.name), tokens=title.split(/\s+/).filter(w=>w.length>2);
    const hits=tokens.filter(t=>words.some(w=>w===t||w.includes(t)||t.includes(w))).length;
    return tokens.length?hits/tokens.length:0;
  };
  const anime=[...(d.anime||[])].map(x=>({...x,_score:score(x)})).sort((a,b)=>b._score-a._score);
  const chars=[...(d.characters||[])].map(x=>({...x,_score:score(x)})).sort((a,b)=>b._score-a._score);
  const a=anime[0],c=chars[0];
  const best=Math.max(a?._score||0,c?._score||0);
  return best>=.5
    ? {status:"matched",anime:a&&a._score>=.5?a:null,character:c&&c._score>=.7?c:null,confidence:Math.min(.98,.55+best*.43),method:"smart catalog match"}
    : {status:"unknown",anime:null,character:null,confidence:0,method:"no confident catalog match"};
}

function renderImportResults(){
  const panel=$("#importPanel");if(!panel)return;
  if(!importItems.length){panel.innerHTML=renderImportWorkspace();initImportWorkspace();return}
  panel.innerHTML=`
    <div class="import-toolbar"><div><span class="kicker">REVIEW IMPORT</span><h2>${importItems.length} media items</h2></div>
      <div class="import-actions"><button class="ghost" id="clearImports">Clear</button><button class="primary" id="saveImports">Save selected to Gallery</button></div></div>
    <div class="import-grid">${importItems.map((x,i)=>`
      <article class="import-card">
        <div class="import-thumb"><img src="${x.image}" alt="${esc(x.name)}"><span class="import-badge">${x.status==="matched"?"MATCHED":"REVIEW"}</span></div>
        <div class="import-body"><strong title="${esc(x.name)}">${esc(x.anime?.title||x.character?.name||x.name)}</strong>
        <small>${x.anime?esc(x.anime.title):"No anime match"}${x.character?" · "+esc(x.character.name):""}</small>
        ${x.confidence?'<div class="confidence"><i style="width:'+Math.round(x.confidence*100)+'%"></i></div><small>'+Math.round(x.confidence*100)+'% confidence · '+esc(x.method)+'</small>':"<small>Keep as personal artwork or edit after import.</small>"}
        </div>
      </article>`).join("")}</div>`;
  $("#clearImports").onclick=()=>{importItems=[];renderImportResults();setImportStatus("Import cleared.")};
  $("#saveImports").onclick=saveImports;
}

async function saveImports(){
  const selected=importItems.filter(x=>x.selected);
  if(!selected.length)return;
  let data={anime:[],characters:[],trailers:[],gallery:[]};
  try{data=JSON.parse(localStorage.getItem(STORE)||"null")||data}catch{}
  const now=Date.now();
  for(const x of selected){
    data.gallery.unshift({id:"imported-"+x.id,title:x.anime?.title||x.character?.name||x.name.replace(/\.[^.]+$/,""),image:x.image,description:[x.anime?.title,x.character?.name].filter(Boolean).join(" · ")||"Imported from device",source:x.source||"device",imported_at:new Date(now).toISOString(),ai_status:x.status,confidence:x.confidence||0});
  }
  try{
    localStorage.setItem(STORE,JSON.stringify(data));
    localStorage.setItem(IMPORT_STORE,JSON.stringify(selected.map(x=>({id:x.id,name:x.name,source:x.source||"device",google_media_id:x.googleId||null,imported_at:new Date(now).toISOString()}))));
    importItems=[];
    renderImportResults();
    setImportStatus("Saved to your local AnimeVerse Gallery. Return to Gallery to see the imported artwork.","ok");
  }catch{
    setImportStatus("Browser storage is full. Try fewer or smaller images.","warn");
  }
}

window.renderImportWorkspace=renderImportWorkspace;
window.initImportWorkspace=initImportWorkspace;