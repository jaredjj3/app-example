import { Db } from '../Db';

const db = Db.instance;

beforeAll(async () => {
  await db.init();
});

afterEach(async () => {
  await db.cleanup();
});

afterAll(async () => {
  await db.close();
});
