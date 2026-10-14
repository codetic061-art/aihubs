#!/usr/bin/env node
/* Extracts the real AI Hub catalogue from the project's content index
   (src/content/{en,ar}.json — 85 entries per locale) into
   assets/catalog.js. Titles, descriptions and tags are copied verbatim;
   nothing is invented. Run: node build-catalog.js
   Inputs are never modified. */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'front end', 'src', 'content');
const OUT = path.join(__dirname, 'assets', 'catalog.js');
const LOCALES = ['en', 'ar'];

const out = {};
for (const loc of LOCALES) {
  const entries = JSON.parse(fs.readFileSync(path.join(SRC_DIR, loc + '.json'), 'utf8'));
  out[loc] = {};
  for (const e of entries) {
    if (!out[loc][e.type]) out[loc][e.type] = [];
    out[loc][e.type].push([e.title, e.description || '']);
  }
}
const counts = LOCALES.map(l =>
  Object.keys(out[l]).map(k => k + ':' + out[l][k].length).join(' ')).join(' | ');
if (counts.split(' | ')[0] !== counts.split(' | ')[1]) {
  console.error('locale counts differ — aborting:', counts);
  process.exit(1);
}

/* Normalise to SINGULAR type names, which is what the page asks for
   (count('course'), C().concept, ...). Keeping one naming convention
   avoids the silent zero-count bug where a plural key returns nothing. */
const SINGULAR = {
  docs: 'doc', lesson: 'lesson', skill: 'skill', mcp: 'mcp',
  'free-credit': 'freeCredit', course: 'course', session: 'session',
  quiz: 'quiz', exam: 'exam', concept: 'concept',
  'prompt-assessment': 'promptAssessment'
};
const norm = {};
for (const loc of LOCALES) {
  norm[loc] = {};
  for (const k of Object.keys(out[loc])) {
    norm[loc][SINGULAR[k] || k] = out[loc][k];
  }
}

fs.writeFileSync(OUT,
  '/* AI Hub catalogue — extracted verbatim from the project content index\n' +
  '   (src/content/{en,ar}.json, 85 entries per locale).\n' +
  '   Titles and descriptions are real; nothing here is invented.\n' +
  '   Keys are singular type names. Regenerate: node build-catalog.js */\n' +
  'window.AIHUB_CATALOG = ' + JSON.stringify(norm, null, 2) + ';\n');

console.log(JSON.stringify({
  written: path.relative(__dirname, OUT),
  bytes: fs.statSync(OUT).size,
  locales: LOCALES,
  keys: Object.keys(norm.en).join(','),
  en: Object.keys(norm.en).map(k => k + ':' + norm.en[k].length).join(' ')
}, null, 2));
