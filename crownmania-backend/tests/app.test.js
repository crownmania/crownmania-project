const request = require('supertest');
const app = require('../server'); // Import the Express app
const mongoose = require('mongoose'); // Import mongoose for connection management

const TOKEN = process.env.TEST_JWT || '<YOUR_TEST_JWT>'; // Replace with actual test token

beforeAll(async () => {
  // Set up database connection if needed
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  // Close database connection
  await mongoose.disconnect();
});

describe('API Endpoints', () => {
  it('Health Check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Server is running!');
  });

  describe('Auth Routes', () => {
    it('Login/Register User', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: '0x1234567890abcdef1234567890abcdef12345678' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Collectible Routes', () => {
    it('Get My Collectibles', async () => {
      const res = await request(app)
        .get('/api/collectibles/my-collectibles')
        .set('Authorization', `Bearer ${TOKEN}`); // Replace with valid token
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('Verify a Collectible', async () => {
      const res = await request(app)
        .post('/api/collectibles/verify')
        .send({ id: 'serial123' }); // Replace with actual serial number
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('Claim a Collectible', async () => {
      const res = await request(app)
        .post('/api/collectibles/claim')
        .set('Authorization', `Bearer ${TOKEN}`) // Replace with valid token
        .send({ collectibleId: '<COLLECTIBLE_ID>' }); // Replace with actual ID
      expect(res.statusCode).toEqual(200);
    });

    it('Package a Collectible', async () => {
      const res = await request(app)
        .post('/api/collectibles/package')
        .send({ serialNumber: 'serial123' }); // Replace with actual serial number
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Shopify Routes', () => {
    it('Get Products', async () => {
      const res = await request(app).get('/api/shop/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('Create an Order', async () => {
      const res = await request(app)
        .post('/api/shop/orders')
        .send({
          lineItems: [
            { variant_id: '123456', quantity: 1 },
          ],
          customer: { email: 'customer@example.com' },
        });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('User Routes', () => {
    it('Get My User Info', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${TOKEN}`); // Replace with valid token
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('walletAddress');
    });
  });
});