/** Finish the reveal front-load: near-full opacity at scene entry. */
import { readFileSync, writeFileSync } from 'node:fs'

const files = [
  'Rotator', 'Annotation', 'Growth', 'Fan', 'Teardown',
  'WordPairs', 'Statement', 'Index', 'Closing',
]
for (const name of files) {
  const path = `src/sections/${name}.jsx`
  let text = readFileSync(path, 'utf8')
  const before = text
  text = text.replace(/autoAlpha: 0\.6/g, 'autoAlpha: 0.8')
  text = text.replace(/opacity: 0\.6/g, 'opacity: 0.8')
  text = text.replace(/opacity: 0\.55/g, 'opacity: 0.8')
  if (text !== before) {
    writeFileSync(path, text)
    console.log(`${name}: updated`)
  }
}
