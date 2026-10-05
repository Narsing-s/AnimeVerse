const SESSION_KEY="animeverse:session";
const ACCOUNT_KEY="animeverse:account";

function showApp(){
  document.getElementById("loginScreen")?.classList.add("hidden");
  document.getElementById("appShell")?.classList.remove("hidden");
}

function showLogin(){
  document.getElementById("loginScreen")?.classList.remove("hidden");
  document.getElementById("appShell")?.classList.add("hidden");
}

async function digest(value){
  const bytes=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,"0")).join("");
}

async function signIn(identity,password){
  const saved=localStorage.getItem(ACCOUNT_KEY);
  if(!saved){
    const passwordHash=await digest(password);
    localStorage.setItem(ACCOUNT_KEY,JSON.stringify({identity:identity.trim().toLowerCase(),passwordHash}));
    localStorage.setItem(SESSION_KEY,"1");
    return true;
  }
  const account=JSON.parse(saved);
  const passwordHash=await digest(password);
  return account.identity===identity.trim().toLowerCase()&&account.passwordHash===passwordHash;
}

document.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem(SESSION_KEY)==="1") showApp();
  else showLogin();

  const form=document.getElementById("loginForm");
  form?.addEventListener("submit",async event=>{
    event.preventDefault();
    const error=document.getElementById("loginError");
    error.textContent="";
    const identity=document.getElementById("loginIdentity").value;
    const password=document.getElementById("loginPassword").value;
    try{
      const ok=await signIn(identity,password);
      if(!ok){
        error.textContent="That sign-in does not match the account saved on this device.";
        return;
      }
      showApp();
      window.dispatchEvent(new Event("animeverse:authenticated"));
    }catch{
      error.textContent="Unable to sign in on this device. Please try again.";
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click",()=>{
    localStorage.removeItem(SESSION_KEY);
    showLogin();
    document.getElementById("loginPassword").value="";
  });
});