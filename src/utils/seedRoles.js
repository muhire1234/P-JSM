const { connectDb, closeDb, seedRoles } = require('./seedData');

const run = async () => {
  try {
    await connectDb();
    await seedRoles();
    console.log('Role seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Role seeding failed:', error.message);
    process.exit(1);
  } finally {
    await closeDb();
  }
};

run();
