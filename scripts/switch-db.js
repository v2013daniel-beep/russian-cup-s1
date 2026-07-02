const fs = require('fs');
const path = require('path');

const target = process.argv[2];

if (!['sqlite', 'postgresql'].includes(target)) {
  console.error('Usage: node scripts/switch-db.js [sqlite|postgresql]');
  process.exit(1);
}

const prismaDir = path.join(__dirname, '..', 'prisma');
const targetSchema = path.join(prismaDir, `schema.${target}.prisma`);
const mainSchema = path.join(prismaDir, 'schema.prisma');

if (!fs.existsSync(targetSchema)) {
  console.error(`Schema file not found: ${targetSchema}`);
  process.exit(1);
}

fs.copyFileSync(targetSchema, mainSchema);
console.log(`Switched to ${target} schema.`);
console.log('Run: npx prisma generate && npx prisma migrate dev');
