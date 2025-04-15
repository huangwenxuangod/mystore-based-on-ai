import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyStore API 文档',
      version: '1.0.0',
      description: '这是 MyStore 电商系统的 API 文档',
      contact: {
        name: 'API Support',
        email: 'support@mystore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '开发服务器'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'string' },
            image: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            rating: { type: 'number' },
            salesCount: { type: 'integer' },
            stock: { type: 'integer' },
            releaseDate: { type: 'string' }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            productId: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'string' },
            image: { type: 'string' },
            quantity: { type: 'integer' },
            selected: { type: 'boolean' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            realName: { type: 'string' },
            phone: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string' },
            avatar: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'] // API 文件的路径
};

const specs = swaggerJsdoc(options);

export default specs; 