import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {analyse,render} from '../src/index.js';import {parseCSV,toCSV,escape} from '../src/util.js';
const data=JSON.parse(fs.readFileSync(new URL('../examples/input.json',import.meta.url),'utf8'));
test('the complete synthetic example produces a readable report',()=>{const r=analyse(data);assert.ok(r.title);assert.ok(r.summary);assert.match(render(r),/<h2>/);assert.ok(Array.isArray(r.issues));});
test('quoted CSV and dangerous spreadsheet values remain safe',()=>{assert.equal(parseCSV('id,note\r\n1,"one, two"')[0].note,'one, two');assert.throws(()=>parseCSV('id,note\n1,"unclosed'),/Unclosed/);assert.match(toCSV([{name:'=HYPERLINK("x")'}]),/'=HYPERLINK/);});
test('HTML escaping never emits an executable supplied tag',()=>{assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;');});

test('shared questions form one service explanation, not one page per row',()=>{const r=analyse(data);assert.equal(r.services[0].questions.length,1);assert.equal(r.services[0].clients.length,2);assert.equal(r.services.length,3);});
test('an unsupported claim is excluded from publication output',()=>{const r=analyse(data);assert.doesNotMatch(JSON.stringify(r),/Unverified savings claim/);assert.ok(r.issues.some(i=>i.code==='claim'));});
test('duplicate planning rows fail without silently dropping content',()=>{const d=structuredClone(data);d.rows.push(d.rows[0]);assert.throws(()=>analyse(d),/Duplicate/);});
