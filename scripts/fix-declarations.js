// Post-process the generated declarations so they work in every TypeScript setup:
// - drop stylesheet side-effect imports (the .scss sources are not published)
// - add explicit .js extensions to relative imports, which "type": "module" packages
//   need under node16/nodenext module resolution
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

const styleImport = /^import ['"][^'"]+\.s?css['"];\r?\n/gm
const relativeSpecifier = /(from\s+|import\s*\(\s*|import\s+)(['"])(\.\.?\/[^'"]+)\2/g

function withExtension(file, specifier) {
  if (/\.[cm]?js$/.test(specifier)) return specifier
  const base = join(dirname(file), specifier)
  if (existsSync(`${base}.d.ts`)) return `${specifier}.js`
  if (existsSync(join(base, 'index.d.ts'))) return `${specifier}/index.js`
  return specifier
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(path)
    } else if (entry.name.endsWith('.d.ts')) {
      const source = readFileSync(path, 'utf8')
      const fixed = source
        .replace(styleImport, '')
        .replace(relativeSpecifier, (_, keyword, quote, specifier) => `${keyword}${quote}${withExtension(path, specifier)}${quote}`)
      if (fixed !== source) writeFileSync(path, fixed)
    }
  }
}

walk('dist')
