#!/usr/bin/env node
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
// find repository root by walking up until we find pnpm-workspace.yaml or .git
const initialDir = path.dirname(new URL(import.meta.url).pathname)
let repoRoot = initialDir
let cur = initialDir
while (true) {
  if (fsSync.existsSync(path.join(cur, 'pnpm-workspace.yaml')) || fsSync.existsSync(path.join(cur, '.git'))) {
    repoRoot = cur
    break
  }
  const parent = path.dirname(cur)
  if (parent === cur) break
  cur = parent
}
const postsDir = path.join(repoRoot, 'packages', 'content', 'posts')

const mappingGroups = {
  'AI': [
    'AI','ChatGPT','GPT','OpenAI','Midjourney','Stable Diffusion','ERNIE-ViLG','DiagramGPT','LogoAI','V0','Watson Discovery'
  ],
  'フロントエンド': [
    'Frontend','HTML','CSS','JavaScript','Javascript','Typescript','React','React Native','Qwik','Lit Element','Web Components','Layout','Design','UX','Micro Frontends','Module Federation','Es Module','iframe','Storybook', 'Figma'
  ],
  'バックエンド': [
    'API','GraphQL','gRPC','tRPC','Clean Architecture','Arch Unit','Ara Framework','Dagger',
  ],
  '成果物': [
    'Artifact'
  ],
  'テスト': [
    'Test','Testing','Unit Test','Jest','Playwright','Puppeteer','Visual Regression Testing','BackstopJS','MSW','Cucumber','Testcontainers','Mock'
  ],
  'クラウドインフラ': [
    'AWS','GCP','Cloud Run','Cloudflare Workers','Edge Worker','Cloud IDE','BigQuery','Docker','Kubernetes'
  ],
  'DevOps': [
    'CI','CircleCI','GitHub Actions','Deploy','DevOps','Unleash'
  ],
  '開発ツール': [
    'Git','GitHub','IntelliJ','Debugger','Lint','JIT','LLVM','Monorepo','Turborepo','OPFS','DuckDB'
  ],
  'ブラウザ': [
    'Web','Browser','Chrome Extension','Manifest V3','OEmbed','OGP','OPFS'
  ],
  'Google': [
    'Google','Google I/O','Google Apps Script','Google Colaboratory','GCalendar','GMail','GDG'
  ],
  'JavaScript': [
    'Node.js','zod','urql'
  ],
  'Go': ['Go'],
  'Golang': ['Golang'],
  'Kotlin': ['Kotlin'],
  'Python': ['Python'],
  'Ruby on Rails': ['Ruby on Rails'],
  'Rust': ['Rust'],
  'クローリング': ['Crawlee','Crawler','Scrap','Scraping'],
  'サービス': ['Algolia','Cloudinary','Spotify','Slack','Zoom','Twitter','TikTok'],
  'レポート': ['Dev Fest','Cloud Native Days','PyConJP','Go Conference','BMXUG','Mix Leap Study','Report'],
  '書籍レビュー': ['Book','Review'],
  '振り返り': ['Looking Back']
}

// build reverse map (lowercase variant -> canonical)
const variantToCanonical = new Map()
for (const [canonical, variants] of Object.entries(mappingGroups)) {
  for (const v of variants) variantToCanonical.set(v.toLowerCase(), canonical)
}

async function* walk(dir) {
  let entries
  try { entries = await fs.readdir(dir, { withFileTypes: true }) }
  catch { return }
  for (const e of entries) {
    const res = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(res)
    else if (e.isFile() && /\.md$/i.test(e.name)) yield res
  }
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (m) return { raw: m[0], body: m[1], start: m.index, end: m.index + m[0].length, inCodeBlock: false }
  // try to find frontmatter inside a code block (```markdown ... ```)
  const codeBlock = content.match(/(`{3,}|`{4,})([^\n]*)\n([\s\S]*?)\n\1/m)
  if (codeBlock) {
    const inner = codeBlock[3]
    const im = inner.match(/^---\n([\s\S]*?)\n---/)
    if (im) {
      const blockStart = codeBlock.index
      const innerStart = blockStart + codeBlock[0].indexOf(inner)
      const fmStart = innerStart + im.index
      const fmEnd = fmStart + im[0].length
      return {
        raw: im[0],
        body: im[1],
        start: fmStart,
        end: fmEnd,
        inCodeBlock: true,
        codeBlockStart: blockStart,
        codeBlockEnd: blockStart + codeBlock[0].length,
        codeBlockFence: codeBlock[1],
        codeBlockLang: codeBlock[2],
        codeBlockInnerStart: innerStart,
        codeBlockInner: inner
      }
    }
  }
  return null
}

function extractTagsFromFM(fmBody) {
  // block format
  const block = fmBody.match(/tags:\s*\n((?:\s*-\s*.*\n)+)/i)
  if (block) {
    const lines = block[1].split(/\n/).map(l => l.trim()).filter(Boolean)
    return { style: 'block', rawMatch: block[0], tags: lines.map(l => l.replace(/^[-\s]*/, '').replace(/^['\"]|['\"]$/g, '').trim()) }
  }
  // inline array format
  const inline = fmBody.match(/tags:\s*\[(.*?)\]/is)
  if (inline) {
    const inner = inline[1].trim()
    const parts = inner.split(/,/) .map(s => s.replace(/^\s*['\"]?/, '').replace(/['\"]?\s*$/, '').trim()).filter(Boolean)
    return { style: 'inline', rawMatch: inline[0], tags: parts }
  }
  return null
}

function normalizeTag(t) {
  const key = t.trim().toLowerCase()
  if (variantToCanonical.has(key)) return variantToCanonical.get(key)
  return t.trim()
}

async function main() {
  const changedFiles = []
  for await (const file of walk(postsDir)) {
    const content = await fs.readFile(file, 'utf8')
    const fm = parseFrontmatter(content)
    if (!fm) continue
    const tagsInfo = extractTagsFromFM(fm.body)
    if (!tagsInfo) continue
    // map known variants to canonical names; preserve unknown tags as-is
    const mapped = tagsInfo.tags
      .map((t) => normalizeTag(t))
      .filter((t) => t.length > 0)
    // If JavaScript is present, keep both "フロントエンド" and "JavaScript".
    const hasJavaScript = tagsInfo.tags.some((t) => t.trim().toLowerCase() === 'javascript')
    if (hasJavaScript && !mapped.includes('JavaScript')) mapped.push('JavaScript')
    // preserve order but dedupe
    const dedup = [...new Set(mapped)]
    // produce inline YAML array; if empty produce []
    const replacement = dedup.length === 0
      ? 'tags: []'
      : `tags: [${dedup.map(t => JSON.stringify(t)).join(', ')}]`
    const newFmBody = fm.body.replace(tagsInfo.rawMatch, replacement)
    let newContent
    if (fm.inCodeBlock) {
      // replace frontmatter inside the code block inner text
      const before = content.slice(0, fm.codeBlockInnerStart)
      const after = content.slice(fm.codeBlockInnerStart + fm.codeBlockInner.length)
      const newInner = fm.codeBlockInner.replace(fm.raw, `---\n${newFmBody}\n---`)
      newContent = before + newInner + after
    } else {
      newContent = content.slice(0, fm.start) + `---\n${newFmBody}\n---` + content.slice(fm.end)
    }
    if (newContent !== content) {
      console.log(`normalize-tags: updating ${file}`)
      console.log('  original tags:', tagsInfo.tags.join(', '))
      console.log('  normalized tags:', dedup.join(', '))
      await fs.writeFile(file, newContent, 'utf8')
      changedFiles.push(file)
    }
  }
  console.log(`Normalized tags. Files changed: ${changedFiles.length}`)
  for (const f of changedFiles) console.log(' -', f)
  if (changedFiles.length === 0) process.exit(0)
}

main().catch(err => { console.error(err); process.exit(2) })
