import { PrismaClient, Role, AuditEventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@dafel.tech' },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash('DafelSecure2025!', 12);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dafel.tech',
      name: 'System Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create initial audit log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      eventType: AuditEventType.USER_CREATED,
      eventDetail: 'Initial admin user created via seed script',
      success: true,
    },
  });

  console.log('✅ Created audit log for admin creation');

  // Create additional demo users (optional)
  const demoUsers = [
    {
      email: 'editor@dafel.tech',
      name: 'Editor User',
      role: Role.EDITOR,
      password: 'EditorPass2025!',
    },
    {
      email: 'viewer@dafel.tech',
      name: 'Viewer User',
      role: Role.VIEWER,
      password: 'ViewerPass2025!',
    },
  ];

  for (const userData of demoUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role,
        emailVerified: new Date(),
        isActive: true,
        createdById: adminUser.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        eventType: AuditEventType.USER_CREATED,
        eventDetail: `Demo user created: ${user.email}`,
        success: true,
      },
    });

    console.log(`✅ Created demo user: ${user.email}`);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('-------------------');
  console.log('Admin: admin@dafel.tech / DafelSecure2025!');
  console.log('Editor: editor@dafel.tech / EditorPass2025!');
  console.log('Viewer: viewer@dafel.tech / ViewerPass2025!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });