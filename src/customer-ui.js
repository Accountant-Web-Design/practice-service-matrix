// Browser and Node-safe presentation primitives. Inputs are always escaped.
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const clean = value => String(value ?? '').trim();
export const lines = value => clean(value).split(/\n+/).map(clean).filter(Boolean);
export const selected = value => Array.isArray(value) ? value.map(clean).filter(Boolean) : [];
export function requireText(value, label) { const s=clean(value); if(!s) throw Error('Please enter '+label+'.'); return s; }
export function number(value, label, {min=0,max=1e9,integer=false,optional=false}={}) {
  if(clean(value)===''&&optional) return null;
  if(clean(value)===''||!/^\d+(\.\d+)?$/.test(clean(value))) throw Error('Enter a valid number for '+label+'.');
  const n=Number(value); if(!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n))) throw Error(label+' must be '+(integer?'a whole number ':'')+'between '+min+' and '+max+'.'); return n;
}
export function pence(value,label='price') { const s=clean(value); if(!/^\d+(\.\d{1,2})?$/.test(s)) throw Error('Enter '+label+' in pounds, using no more than two decimal places.'); const [a,b='']=s.split('.'); const n=Number(a)*100+Number(b.padEnd(2,'0')); if(!Number.isSafeInteger(n)||n>1e11)throw Error(label+' is too large.'); return n; }
export const pounds = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n/100);
export const section = (title,items) => ({title,items:items.filter(Boolean)});
export const report = (title,summary,sections=[],extra={}) => ({title,summary,sections,...extra});
export function enumValue(value,allowed,label){if(!allowed.includes(value))throw Error('Choose '+label+'.');return value;}
export function webAddress(value) { const s=clean(value); if(!s)return ''; let u;try{u=new URL(/^https?:\/\//i.test(s)?s:'https://'+s);}catch{throw Error('Enter a website address such as example.co.uk.');} if(!['http:','https:'].includes(u.protocol)||u.username||u.password||!u.hostname.includes('.'))throw Error('Enter a public website address without sign-in details.');return u.href; }
export function fieldsHTML(fields,values={},prefix='') {return fields.map(f=>fieldHTML(f,values[f.id],prefix)).join('');}
function fieldHTML(f,value,prefix){const id=prefix+f.id,required=f.required?' required':'',hint=f.help?'<small id="'+id+'-help">'+esc(f.help)+'</small>':'',describe=f.help?' aria-describedby="'+id+'-help"':'',attr=' id="'+id+'" data-field="'+f.id+'"'+required+describe+(f.maxLength?' maxlength="'+f.maxLength+'"':''),label=esc(f.label)+(f.required?' <span class="required">(required)</span>':'');
 const show=f.when?' data-when="'+esc(JSON.stringify(f.when))+'"':'',outer='<div class="field '+(f.wide?'wide':'')+'"'+show+'>';
 if(f.type==='checks'||f.type==='radio')return outer+'<fieldset><legend>'+label+'</legend>'+hint+'<div class="choices">'+f.options.map((o,i)=>{const [v,l]=Array.isArray(o)?o:[o,o];const checked=f.type==='checks'?selected(value).includes(v):value===v;return '<label class="choice" for="'+id+'-'+i+'"><input id="'+id+'-'+i+'" data-field="'+f.id+'" name="'+id+'" type="'+(f.type==='checks'?'checkbox':'radio')+'" value="'+esc(v)+'"'+(checked?' checked':'')+'><span>'+esc(l)+'</span></label>';}).join('')+'</div></fieldset></div>';
 let control;if(f.type==='select')control='<select'+attr+'><option value="">Choose an option</option>'+f.options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return '<option value="'+esc(v)+'"'+(value===v?' selected':'')+'>'+esc(l)+'</option>';}).join('')+'</select>';
 else if(f.type==='textarea')control='<textarea'+attr+' rows="'+(f.rows||3)+'">'+esc(value)+'</textarea>';
 else control='<input'+attr+' type="'+(f.type||'text')+'" value="'+esc(value)+'"'+(f.type==='number'?' min="'+(f.min??0)+'" max="'+(f.max??1e9)+'" step="'+(f.step||'1')+'"':'')+(f.inputmode?' inputmode="'+f.inputmode+'"':'')+'>';
 return outer+'<label for="'+id+'">'+label+'</label>'+hint+control+'</div>';
}
export function repeatHTML(config,values=[{}]){return values.map((v,i)=>'<fieldset class="repeat-row" data-row><legend>'+esc(config.itemLabel)+' '+(i+1)+'</legend><div class="field-grid">'+fieldsHTML(config.fields,v,'row-'+i+'-')+'</div><button class="text-button remove-row" type="button" aria-label="Remove '+esc(config.itemLabel.toLowerCase())+' '+(i+1)+'">Remove this '+esc(config.itemLabel.toLowerCase())+'</button></fieldset>').join('');}
export function reportHTML(r){let body='<div class="report-heading"><span class="eyebrow">Your result</span><h2 tabindex="-1" id="result-title">'+esc(r.title)+'</h2><p>'+esc(r.summary)+'</p></div>';
 if(r.metrics)body+='<div class="metrics">'+r.metrics.map(m=>'<div class="metric"><span>'+esc(m.label)+'</span><strong>'+esc(m.value)+'</strong>'+(m.detail?'<small>'+esc(m.detail)+'</small>':'')+'</div>').join('')+'</div>';
 if(r.menu)body+='<div class="menu-preview">'+[...new Set(r.menu.map(i=>i.category))].map(cat=>'<section><h3>'+esc(cat)+'</h3>'+r.menu.filter(i=>i.category===cat).map(i=>'<article class="menu-item"><div><h4>'+esc(i.name)+'</h4><p>'+esc(i.description)+'</p>'+(i.note?'<small>'+esc(i.note)+'</small>':'')+(i.availability?'<small>'+esc(i.availability)+'</small>':'')+'</div><strong>'+esc(i.price)+'</strong></article>').join('')+'</section>').join('')+'</div>';
 if(r.fees)body+='<div class="table-wrap fee-table"><table><caption>Supplied fees for review</caption><thead><tr><th scope="col">Treatment / service</th><th scope="col">Fee</th><th scope="col">Approved note</th></tr></thead><tbody>'+r.fees.map(i=>'<tr><th scope="row">'+esc(i.name)+'</th><td>'+esc(i.price)+'</td><td>'+esc(i.note)+'</td></tr>').join('')+'</tbody></table></div><div class="fee-cards" aria-label="Supplied fees for review">'+r.fees.map(i=>'<article><h3>'+esc(i.name)+'</h3><p class="fee-amount">'+esc(i.price)+'</p>'+(i.note?'<p>'+esc(i.note)+'</p>':'')+'</article>').join('')+'</div>';
 if(r.story)body+='<article class="story">'+r.story.map(s=>'<section><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p></section>').join('')+'</article>';
 body+=(r.sections||[]).map(s=>'<section class="result-section"><h3>'+esc(s.title)+'</h3><ul>'+s.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul></section>').join('');return body;
}
export function reportText(r){return [r.title,r.summary,...(r.metrics||[]).map(m=>m.label+': '+m.value+(m.detail?' ('+m.detail+')':'')),...(r.menu||[]).map(i=>[i.category,i.name,i.price,i.description,i.note,i.availability].filter(Boolean).join(' | ')),...(r.fees||[]).map(i=>[i.name,i.price,i.note].filter(Boolean).join(' | ')),...(r.story||[]).map(s=>s.title+'\n'+s.text),...(r.sections||[]).map(s=>s.title+'\n'+s.items.map(i=>'- '+i).join('\n'))].join('\n\n');}
