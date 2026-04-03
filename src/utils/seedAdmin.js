const { connectDb, closeDb, seedRoles, seedAdminAndUsers } = require('./seedData');

const run = async () => {
  try {
    await connectDb();
    await seedRoles();
    await seedAdminAndUsers();
    console.log('Admin/user seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Admin/user seeding failed:', error.message);
    process.exit(1);
  } finally {
    await closeDb();
  }
};

run();
