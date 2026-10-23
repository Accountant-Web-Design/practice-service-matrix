import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.resolve(root,'_site');
if(path.dirname(out)!==root||path.basename(out)!=='_site')throw Error('Unexpected Pages output path');
try{const stat=await fs.lstat(out);if(stat.isSymbolicLink())throw Error('Pages output must not be a symlink');const actual=await fs.realpath(out),parent=await fs.realpath(root);if(actual!==path.join(parent,'_site'))throw Error('Pages output outside resource');await fs.rm(out,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
await fs.mkdir(out,{recursive:true});const meta=JSON.parse(await fs.readFile(path.join(root,'resource.json'),'utf8')),url='https://'+meta.org.toLowerCase()+'.github.io/'+meta.slug+'/',repo='https://github.com/'+meta.org+'/'+meta.slug;
await fs.cp(path.join(root,'demo'),path.join(out,'demo'),{recursive:true});
if(meta.slug!=='trades-site-audit-kit')await fs.cp(path.join(root,'src'),path.join(out,'src'),{recursive:true});
else await fs.rm(path.join(out,'demo','app.js'),{force:true});
await fs.mkdir(path.join(out,'examples'),{recursive:true});
for(const file of ['input.json','output.html','output.json','output.md'])await fs.copyFile(path.join(root,'examples',file),path.join(out,'examples',file));
if(meta.slug==='keyboard-drawer-lab')await fs.copyFile(path.join(root,'examples/minimal.html'),path.join(out,'examples/minimal.html'));
const metaTags='<link rel="canonical" href="'+url+'"><meta property="og:title" content="'+meta.title+'"><meta property="og:url" content="'+url+'"><meta property="og:type" content="website">';
let demo=await fs.readFile(path.join(out,'demo/index.html'),'utf8');demo=demo.replace('</head>',metaTags+'</head>');await fs.writeFile(path.join(out,'demo/index.html'),demo);
let html=demo.replace('src="./app.js"','src="./demo/app.js"').replace('src="lab.js"','src="./demo/lab.js"').replace('href="style.css"','href="./demo/style.css"').replace('href="../src/drawer.css"','href="./src/drawer.css"');
if(!html.includes('href="https://'+meta.domain+'/"'))throw Error('Missing matching EMD maintainer link');
await fs.writeFile(path.join(out,'index.html'),html);await fs.writeFile(path.join(out,'.nojekyll'),'');
await fs.writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+url+'</loc></url></urlset>');
await fs.writeFile(path.join(out,'404.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | '+meta.title+'</title></head><body><main><h1>Page not found</h1><p><a href="'+url+'">Open '+meta.title+'</a> or <a href="'+repo+'">read the source documentation</a>.</p><p>Maintained by <a href="https://'+meta.domain+'/">'+meta.brand+'</a>, operated by JW Digital Services Ltd.</p></main></body></html>');
console.log('Pages artifact built: '+url+' with matching EMD maintainer link');
