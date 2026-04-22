const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create sample guests
  const guest1 = await prisma.guest.create({
    data: {
      name: 'Sarah Chen',
      bio: 'Tech entrepreneur and AI researcher with 10 years of experience in machine learning.',
      expertise: JSON.stringify(['AI', 'Machine Learning', 'Startups']),
      ownerId: user.id,
    },
  });

  const guest2 = await prisma.guest.create({
    data: {
      name: 'Marcus Johnson',
      bio: 'Marketing expert and author of "Digital Growth Strategies".',
      expertise: JSON.stringify(['Marketing', 'SaaS', 'Growth']),
      ownerId: user.id,
    },
  });

  console.log('✅ Created guests:', guest1.name, ',', guest2.name);

  // Create sample episodes
  const episode1 = await prisma.episode.create({
    data: {
      title: 'Introduction to AI',
      episodeNumber: 1,
      description: 'An introductory episode about artificial intelligence and its impact on modern business.',
      status: 'draft',
      tags: JSON.stringify(['AI', 'Technology', 'Introduction']),
      guestId: guest1.id,
      ownerId: user.id,
    },
  });

  const episode2 = await prisma.episode.create({
    data: {
      title: 'Growth Marketing Strategies for 2026',
      episodeNumber: 2,
      description: 'Deep dive into effective marketing strategies for startups and scale-ups.',
      status: 'scripted',
      tags: JSON.stringify(['Marketing', 'Growth', 'Startups']),
      guestId: guest2.id,
      ownerId: user.id,
    },
  });

  const episode3 = await prisma.episode.create({
    data: {
      title: 'The Future of Remote Work',
      episodeNumber: 3,
      description: 'Exploring how remote work is reshaping the modern workplace.',
      status: 'published',
      tags: JSON.stringify(['Remote Work', 'Future of Work', 'Productivity']),
      ownerId: user.id,
    },
  });

  console.log('✅ Created episodes:', episode1.title, ',', episode2.title, ',', episode3.title);

  // Create sample script for episode2
  await prisma.script.create({
    data: {
      episodeId: episode2.id,
      content: `# Growth Marketing Strategies for 2026\n\n## INTRO\n\nWelcome to the show! Today we're diving deep into growth marketing with Marcus Johnson...\n\n## MAIN CONTENT\n\n...\n\n## OUTRO\n\nThanks for listening!`,
      contentType: 'full_script',
      tone: 'professional',
      length: 'medium',
    },
  });

  console.log('✅ Created sample script');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
