import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { gzipSync } from 'zlib'

const distPath = join(process.cwd(), 'dist')
const budgets = {
  html: 20 * 1024, // 20KB
  css: 60 * 1024,  // 60KB
  js: 10 * 1024    // 10KB
}

function getGzipSize(filePath) {
  try {
    const content = readFileSync(filePath)
    return gzipSync(content).length
  } catch (err) {
    return 0
  }
}

function checkSize(filePath, type, budget) {
  const gzSize = getGzipSize(filePath)
  const kb = (gzSize / 1024).toFixed(2)
  const budgetKb = (budget / 1024).toFixed(2)
  
  if (gzSize > budget) {
    console.error(`❌ ${type.toUpperCase()}: ${kb}KB (budget: ${budgetKb}KB)`)
    return false
  } else {
    console.log(`✅ ${type.toUpperCase()}: ${kb}KB (budget: ${budgetKb}KB)`)
    return true
  }
}

// Check index.html
const indexPath = join(distPath, 'index.html')
if (statSync(indexPath, { throwIfNoEntry: false })) {
  checkSize(indexPath, 'html', budgets.html)
}

// Check CSS files
import { readdirSync } from 'fs'
const cssFiles = readdirSync(distPath, { recursive: true })
  .filter(f => f.endsWith('.css'))
  .map(f => join(distPath, f))

let totalCss = 0
cssFiles.forEach(file => {
  totalCss += getGzipSize(file)
})
const cssKb = (totalCss / 1024).toFixed(2)
if (totalCss > budgets.css) {
  console.error(`❌ CSS: ${cssKb}KB (budget: ${(budgets.css / 1024).toFixed(2)}KB)`)
  process.exit(1)
} else {
  console.log(`✅ CSS: ${cssKb}KB (budget: ${(budgets.css / 1024).toFixed(2)}KB)`)
}

// Check JS files
const jsFiles = readdirSync(distPath, { recursive: true })
  .filter(f => f.endsWith('.js') && !f.includes('_worker'))
  .map(f => join(distPath, f))

let totalJs = 0
jsFiles.forEach(file => {
  totalJs += getGzipSize(file)
})
const jsKb = (totalJs / 1024).toFixed(2)
if (totalJs > budgets.js) {
  console.error(`❌ JS: ${jsKb}KB (budget: ${(budgets.js / 1024).toFixed(2)}KB)`)
  process.exit(1)
} else {
  console.log(`✅ JS: ${jsKb}KB (budget: ${(budgets.js / 1024).toFixed(2)}KB)`)
}

console.log('\n✅ All size budgets met!')

