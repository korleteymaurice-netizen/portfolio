export function body(req){return req.body&&typeof req.body==='object'?req.body:{};}
export function required(obj,fields){for(const f of fields)if(obj[f]===undefined||obj[f]===null||String(obj[f]).trim()==='')return `${f} is required`;return null;}
export function email(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||''));}
