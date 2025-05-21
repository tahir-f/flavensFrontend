import { Client, Databases, ID } from 'node-appwrite';

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68288473000c3d95c948';
const API_KEY = 'standard_389cd5e6135dbf940672e7da7b86195bde806ddd7637defc41b152847bcd9231c4a580766480bfdf09873672481775d0d3e0b48756fec063e1c738f36607a436a00e3b32c63312d2536dee981e467a4029a75c0ecf18b6f35cd1b3d24a8c0142c06f2d0ffd9c9a1be9e615d914e99005b662e5628c7e868decd2c354b49e0e2e';

const DATABASE_ID = '68295a2800232b646b55';
const TABLES_COLLECTION_ID = '6829606b0033b306dc3c'; // Your tables collection ID

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const tables = [
  { table_number: 1, capacity: 2, status: 'available' },
  { table_number: 2, capacity: 4, status: 'available' },
  { table_number: 3, capacity: 2, status: 'available' },
  { table_number: 4, capacity: 6, status: 'available' },
  { table_number: 5, capacity: 4, status: 'available' },
  { table_number: 6, capacity: 2, status: 'available' },
  { table_number: 7, capacity: 8, status: 'available' },
  { table_number: 8, capacity: 4, status: 'available' }
];

async function seedTables() {
  try {
    for (const table of tables) {
      await databases.createDocument(
        DATABASE_ID,
        TABLES_COLLECTION_ID,
        ID.unique(),
        table
      );
      console.log(`Seeded table #${table.table_number}`);
    }
    console.log('All tables seeded!');
  } catch (err) {
    console.error('Seeding tables failed:', err.message);
  }
}

seedTables();