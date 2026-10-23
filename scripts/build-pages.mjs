import fs from 'node:fs/promises';import path from 'node:path';
import {esc} from '../src/customer-ui.js';
const root=path.resolve(import.meta.dirname,'..'),out=path.resolve(root,'_site');
if(path.dirname(out)!==root||path.basename(out)!=='_site')throw Error('Unexpected Pages output path');
try{const stat=await fs.lstat(out);if(stat.isSymbolicLink())throw Error('Pages output must not be a symlink');const actual=await fs.realpath(out),parent=await fs.realpath(root);if(actual!==path.join(parent,'_site'))throw Error('Pages output outside resource');await fs.rm(out,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
await fs.mkdir(out,{recursive:true});const meta=JSON.parse(await fs.readFile(path.join(root,'resource.json'),'utf8')),url='https://'+meta.org.toLowerCase()+'.github.io/'+meta.slug+'/';
await fs.cp(path.join(root,'demo'),path.join(out,'demo'),{recursive:true});
await fs.mkdir(path.join(out,'src'),{recursive:true});
for(const file of ['customer.js','customer-ui.js'])await fs.copyFile(path.join(root,'src',file),path.join(out,'src',file));
await fs.mkdir(path.join(out,'examples'),{recursive:true});
for(const file of ['customer-input.json','customer-output.html','customer-output.txt'])await fs.copyFile(path.join(root,'examples',file),path.join(out,'examples',file));
const metaTags='<link rel="canonical" href="'+url+'"><meta property="og:title" content="'+esc(meta.title)+'"><meta property="og:url" content="'+url+'"><meta property="og:type" content="website">';
let demo=await fs.readFile(path.join(out,'demo/index.html'),'utf8');demo=demo.replace('</head>',metaTags+'</head>');await fs.writeFile(path.join(out,'demo/index.html'),demo);
let html=demo.replace('src="./app.js"','src="./demo/app.js"').replaceAll('url("./assets/','url("./demo/assets/').replace('href="./assets/mark.svg"','href="./demo/assets/mark.svg"').replaceAll('href="../examples/','href="./examples/');
if(!html.includes('href="https://'+meta.domain+'/"'))throw Error('Missing matching EMD maintainer link');
await fs.writeFile(path.join(out,'index.html'),html);await fs.writeFile(path.join(out,'.nojekyll'),'');
await fs.writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+url+'</loc></url></urlset>');
await fs.writeFile(path.join(out,'404.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found</title></head><body><main><h1>Page not found</h1><p><a href="'+url+'">Open '+esc(meta.title)+'</a></p></main></body></html>');
console.log('Pages artifact built: '+url);
