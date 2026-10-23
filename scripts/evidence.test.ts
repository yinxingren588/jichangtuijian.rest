import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {evidenceRecords,summaryCharts,platforms} from '../src/data/evidence';
import {airports,partnerAirports,airportCandidates} from '../src/data/airports';

test('all 28 reference brands have exactly one paired chart record; WaveNet remains chart-only',()=>{
 assert.equal(evidenceRecords.length,29);
 assert.equal(new Set(evidenceRecords.map(r=>r.slug)).size,29);
 assert.deepEqual(evidenceRecords.filter(r=>r.brandSlug).map(r=>r.brandSlug).sort(),partnerAirports.map(a=>a.slug).sort());
 assert.equal(airportCandidates.length,0);
 const extra=evidenceRecords.filter(r=>!r.brandSlug);assert.equal(extra.length,1);assert.equal(extra[0].slug,'wavenet');
 for(const record of evidenceRecords){
  assert.equal(record.sourceType,'maintainer-provided');assert.equal(record.independentlyVerified,false);assert.equal(record.timeZone,null);assert.equal(record.nodeCount,60);
  assert.match(record.time,/^2026-10-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.equal(record.greenCounts.length,platforms.length);record.greenCounts.forEach(n=>assert.ok(Number.isInteger(n)&&n>=0&&n<=record.nodeCount));
  assert.ok(record.speed.source.includes(record.name));assert.ok(record.unlock.source.includes(record.name));
  assert.equal(record.greenCounts[9],60);assert.ok(record.peakDownloadMBps>record.averageDownloadMBps);
  if(record.brandSlug)assert.equal(airports.find(a=>a.slug===record.brandSlug)!.testStatus,'unverified');
 }
 assert.match(evidenceRecords[0].speed.source,/IEPL专线_高清/);
 assert.match(summaryCharts.speed.source,/IEPL修订/);
});

test('all 60 original PNGs retain supplied bytes, dimensions and hashes; previews are smaller and dimensioned',()=>{
 const assets=[...evidenceRecords.flatMap(r=>[r.speed,r.unlock]),summaryCharts.speed,summaryCharts.unlock];
 assert.equal(assets.length,60);assert.equal(new Set(assets.map(a=>a.original)).size,60);
 for(const asset of assets){
  const source=fs.readFileSync('public'+asset.original);const built=fs.readFileSync('dist'+asset.original);const preview=fs.readFileSync('dist'+asset.preview);
  assert.equal(source.subarray(1,4).toString(),'PNG');assert.equal(source.readUInt32BE(16),asset.width);assert.equal(source.readUInt32BE(20),asset.height);
  assert.equal(source.length,asset.bytes);assert.equal(crypto.createHash('sha256').update(source).digest('hex'),asset.sha256);assert.deepEqual(built,source);
  assert.equal(preview.length,asset.previewBytes);assert.ok(preview.length<source.length);assert.equal(preview.subarray(8,12).toString(),'WEBP');
  assert.equal(asset.previewWidth,1200);assert.ok(Math.abs(asset.previewHeight/asset.previewWidth-asset.height/asset.width)<.001);
 }
});

test('brand charts, accessible summaries and hub anchors retain source boundaries and original units',()=>{
 for(const record of evidenceRecords.filter(r=>r.brandSlug)){
  const $=load(fs.readFileSync('dist/airport/'+record.brandSlug+'/index.html','utf8'));const section=$('[data-evidence-state="provided"]');
  assert.equal(section.length,1);assert.equal(section.attr('data-evidence-brand'),record.slug);
  assert.equal(section.find('[data-chart-open]').length,2);assert.equal(section.find('img[loading="lazy"]').length,2);
  for(const asset of [record.speed,record.unlock]){assert.equal(section.find('a[data-chart-open]').toArray().filter(e=>$(e).attr('href')===asset.original).length,1);assert.equal(section.find('img[src="'+asset.preview+'"]').length,1);}
  for(const label of ['MB/s','Mbps','时区未注明','未独立复测','Steam','不作解锁率','绿色状态节点数'])assert.ok(section.text().includes(label),record.slug+' '+label);
  assert.equal(section.find('.unlock-grid>div').length,10);assert.equal(section.find('time').text(),record.time);
 }
 const $=load(fs.readFileSync('dist/evidence/index.html','utf8'));
 assert.equal($('[data-evidence-search]').length,29);assert.equal($('[data-chart-open]').length,4);assert.equal($('#wavenet').length,1);
 assert.equal($('a[href^="/airport/wavenet"]').length,0);
 for(const record of evidenceRecords.filter(r=>r.brandSlug)){assert.equal($('[id="'+record.slug+'"]').length,1);assert.ok($('a').toArray().some(e=>$(e).attr('href')==='/airport/'+record.slug+'/#performance-evidence'));}
});
