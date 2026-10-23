import {array,text,issue,escape,list,issuesHTML} from './util.js';
export const guide='Supply practice and rows with service, client_type, client_question, scope, inclusions, exclusions, evidence_needed, next_step and content_owner. claims is an optional list of {text, approved}. Rows produce a brief, not a page-per-row recommendation.';
export function analyse(input){
 text(input.practice,'practice');const issues=[],seen=new Set();
 const rows=array(input.rows,'rows').map((row,i)=>{
  for(const key of ['service','client_type','client_question','scope','next_step'])text(row[key],key);
  const id=[row.service,row.client_type,row.client_question].map(s=>s.toLowerCase().trim()).join('|');if(seen.has(id))throw Error('Duplicate service/client/question row');seen.add(id);
  if(!row.content_owner)issues.push(issue('owner','Assign a content owner',row.service));
  if(row.evidence_needed)issues.push(issue('evidence','Confirm: '+row.evidence_needed,row.service));
  const claims=array(row.claims||[],'claims');for(const claim of claims){text(claim.text,'claim.text');if(claim.approved!==true)issues.push(issue('claim','An unapproved claim is excluded from the publication brief',row.service));}
  return {...row,claims:claims.filter(c=>c.approved===true).map(c=>c.text)};
 });
 const services=[...new Set(rows.map(r=>r.service))].map(name=>{const selected=rows.filter(r=>r.service===name);return {name,clients:[...new Set(selected.map(r=>r.client_type))],questions:[...new Set(selected.map(r=>r.client_question.trim()))],rows:selected};});
 const markdown=services.map(s=>'## '+s.name+'\n\nFor: '+s.clients.join(', ')+'\n\n'+s.questions.map(q=>'- '+q).join('\n')+'\n\n'+s.rows.map(r=>r.scope+'\nIncluded: '+(r.inclusions||'Confirm')+'\nExcluded: '+(r.exclusions||'Confirm')+'\nNext step: '+r.next_step+(r.claims.length?'\nApproved claims: '+r.claims.join('; '):'')).join('\n\n')).join('\n\n');
 return {title:input.practice+' service brief',summary:'Grouped by service and shared client question. No tax advice or automatic page recommendations.',services,issues,markdown};
}
export const render=r=>'<h2>'+escape(r.title)+'</h2><p>'+escape(r.summary)+'</p><div class="grid">'+r.services.map(s=>'<section class="card"><span class="badge">'+escape(s.clients.join(', '))+'</span><h3>'+escape(s.name)+'</h3>'+list(s.questions)+s.rows.map(row=>'<p>'+escape(row.scope)+'</p><p><strong>Includes:</strong> '+escape(row.inclusions||'Confirm')+'</p><p><strong>Excludes:</strong> '+escape(row.exclusions||'Confirm')+'</p><p><strong>Next step:</strong> '+escape(row.next_step)+'</p>'+list(row.claims)).join('')+'</section>').join('')+'</div>'+issuesHTML(r.issues);
