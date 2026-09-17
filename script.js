"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const form=$("#generatorForm"),output=$("#output"),outputHint=$("#outputHint"),copyAll=$("#copyAllButton"),clear=$("#clearButton");
const BASE={uppercase:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",lowercase:"abcdefghijklmnopqrstuvwxyz",numbers:"0123456789"},AMBIGUOUS=new Set("Il1O0o"),media=matchMedia("(prefers-color-scheme: dark)");
let appearance="system",passwords=[];

/* Appearance */
function applyTheme(){const theme=appearance==="system"?(media.matches?"dark":"light"):appearance;document.documentElement.dataset.theme=theme;$("#appearance").textContent=`Appearance · ${{system:"System",light:"Light",dark:"Dark"}[appearance]}`}
$("#appearance").onclick=()=>{const modes=["system","light","dark"];appearance=modes[(modes.indexOf(appearance)+1)%modes.length];applyTheme()};
media.addEventListener?.("change",()=>appearance==="system"&&applyTheme());

/* Character sets */
const unique=s=>[...new Set(String(s))].join("");
const filtered=s=>$("#excludeAmbiguous").checked?[...s].filter(c=>!AMBIGUOUS.has(c)).join(""):s;
function activeSets(){
  const sets=[];
  if($("#uppercase").checked)sets.push(filtered(BASE.uppercase));
  if($("#lowercase").checked)sets.push(filtered(BASE.lowercase));
  if($("#numbers").checked)sets.push(filtered(BASE.numbers));
  if($("#symbols").checked)sets.push(filtered(unique($("#symbolSet").value)));
  return sets.filter(Boolean);
}
function updatePool(){
  const pool=unique(activeSets().join(""));
  $("#poolHint").textContent=pool.length?`${pool.length} character pool`:"No characters selected";
}
function syncOptions(){
  $$(".select-control[data-option]").forEach(card=>{const on=$(`#${card.dataset.option}`).checked;card.classList.toggle("active",on);card.setAttribute("aria-pressed",on)});
  const on=$("#symbols").checked,symbolSet=$("#symbolSet");$("#symbolToggle").classList.toggle("active",on);$("#symbolToggle").setAttribute("aria-pressed",on);$("#symbolToggle").setAttribute("aria-expanded",on);symbolSet.disabled=!on;symbolSet.hidden=!on;updatePool();
}
$$(".select-control[data-option]").forEach(card=>card.onclick=()=>{const el=$(`#${card.dataset.option}`);el.checked=!el.checked;syncOptions()});
$("#symbolToggle").onclick=()=>{$("#symbols").checked=!$("#symbols").checked;syncOptions()};
$("#excludeAmbiguous").onchange=updatePool;
$("#symbolSet").oninput=updatePool;

/* Secure generation */
function randomInt(max){
  if(!Number.isSafeInteger(max)||max<=0||max>0x100000000)throw new RangeError("Invalid random range.");
  const limit=Math.floor(0x100000000/max)*max,v=new Uint32Array(1);
  do{crypto.getRandomValues(v)}while(v[0]>=limit);
  return v[0]%max;
}
const randomChar=set=>set[randomInt(set.length)];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function buildPassword(prefix,length,sets){
  const remaining=length-prefix.length,pool=unique(sets.join("")),chars=[];
  for(const set of sets)chars.push(randomChar(set));
  while(chars.length<remaining)chars.push(randomChar(pool));
  return prefix+shuffle(chars).join("");
}

/* Output */
function message(text,error=false){
  passwords=[];output.innerHTML="";
  const e=document.createElement("div");e.className=`empty${error?" error":""}`;e.textContent=text;output.append(e);
  outputHint.textContent="Click any password to copy";copyAll.disabled=true;clear.disabled=true;
}
function render(){
  const frag=document.createDocumentFragment();
  passwords.forEach((password,i)=>{
    const item=document.createElement("button");item.type="button";item.className="item";item.dataset.password=password;item.setAttribute("aria-label",`Copy password ${i+1}`);
    const text=document.createElement("span");text.className="password";text.textContent=password;
    const status=document.createElement("span");status.className="copied-label";status.textContent="Copied";
    item.append(text,status);frag.append(item);
  });
  output.replaceChildren(frag);outputHint.textContent=`${passwords.length} generated · Click to copy`;copyAll.disabled=false;clear.disabled=false;
}

/* Generate */
form.addEventListener("submit",e=>{
  e.preventDefault();
  const prefix=$("#prefix").value,length=Number($("#length").value),quantity=Number($("#quantity").value),sets=activeSets();

  if(!sets.length)return message("Select at least one usable character type.",true);
  if(!Number.isInteger(length)||length<4||length>128)return message("Length must be a whole number from 4 to 128.",true);
  if(!Number.isInteger(quantity)||quantity<1||quantity>100)return message("Quantity must be a whole number from 1 to 100.",true);
  if(prefix.length>=length)return message("Prefix must be shorter than the password length.",true);
  if(length-prefix.length<sets.length)return message("Increase the length or enable fewer character types.",true);

  passwords=Array.from({length:quantity},()=>buildPassword(prefix,length,sets));
  render();
});

/* Clipboard */
output.onclick=async e=>{
  const item=e.target.closest(".item");if(!item)return;
  try{await navigator.clipboard.writeText(item.dataset.password);item.classList.add("copied");setTimeout(()=>item.classList.remove("copied"),800)}
  catch{const old=outputHint.textContent;outputHint.textContent="Clipboard access blocked";setTimeout(()=>outputHint.textContent=old,1000)}
};
copyAll.onclick=async()=>{
  if(!passwords.length)return;
  try{await navigator.clipboard.writeText(passwords.join("\n"));const old=copyAll.textContent;copyAll.textContent="Copied";setTimeout(()=>copyAll.textContent=old,800)}
  catch{const old=copyAll.textContent;copyAll.textContent="Blocked";setTimeout(()=>copyAll.textContent=old,800)}
};
clear.onclick=()=>message("Generated passwords will appear here.");

applyTheme();
syncOptions();

