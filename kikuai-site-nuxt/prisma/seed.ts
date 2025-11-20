import { execSync } from 'child_process'

async function main() {
  console.log('Running seed script...')
  execSync('tsx prisma/seeds/products.ts', { stdio: 'inherit' })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

