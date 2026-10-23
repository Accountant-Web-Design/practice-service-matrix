import fs from 'node:fs/promises';import {analyse,render,guide} from '../src/index.js';import {asMarkdown} from '../src/util.js';import {documentHTML} from './html.mjs';
const root=new URL('../',import.meta.url),meta=JSON.parse(await fs.readFile(new URL('resource.json',root),'utf8')),input=JSON.parse(await fs.readFile(new URL('examples/input.json',root),'utf8')),result=analyse(input);
await fs.writeFile(new URL('examples/output.json',root),JSON.stringify(result,null,2)+'\n');await fs.writeFile(new URL('examples/output.md',root),asMarkdown(result));
if(meta.slug!=='keyboard-drawer-lab')await fs.writeFile(new URL('demo/index.html',root),await documentHTML(meta,render(result),{interactive:meta.slug!=='trades-site-audit-kit',input:JSON.stringify(input,null,2),guide}));
await fs.writeFile(new URL('examples/output.html',root),await documentHTML(meta,render(result)));
console.log('Built '+meta.slug+': complete HTML, JSON and Markdown examples');
