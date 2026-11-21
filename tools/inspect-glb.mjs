/** Print mesh + material names from the GLB's JSON chunk — no renderer needed. */
import { readFileSync } from 'node:fs'

const buf = readFileSync('public/models/sneaker.glb')
const jsonLength = buf.readUInt32LE(12)
const json = JSON.parse(buf.subarray(20, 20 + jsonLength).toString('utf8'))

console.log('materials:', (json.materials ?? []).map((m) => m.name).join(' | '))
console.log('meshes:')
for (const mesh of json.meshes ?? []) {
  console.log(`  ${mesh.name}  ::  ${(mesh.primitives ?? []).map((p) => {
    const mat = json.materials?.[p.material]
    return mat?.name ?? 'n/a'
  }).join(', ')}`)
}
console.log('nodes:', (json.nodes ?? []).map((n) => n.name).filter(Boolean).join(' | ').slice(0, 1200))
