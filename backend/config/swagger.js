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
        // 商品相关模型
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'string' },
            originalPrice: { type: 'string' },
            discount: { type: 'integer' },
            image: { type: 'string' },
            images: { 
              type: 'array',
              items: { type: 'string' }
            },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            categoryId: { type: 'string' },
            brandId: { type: 'string' },
            rating: { type: 'number' },
            reviewCount: { type: 'integer' },
            salesCount: { type: 'integer' },
            stock: { type: 'integer' },
            releaseDate: { type: 'string' },
            isNew: { type: 'boolean' },
            features: {
              type: 'array',
              items: { type: 'string' }
            },
            specifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            }
          }
        },
        // 购物车相关模型
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            productId: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'string' },
            image: { type: 'string' },
            quantity: { type: 'integer' },
            selected: { type: 'boolean' },
            stock: { type: 'integer' }
          }
        },
        // 用户相关模型
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
            avatar: { type: 'string' },
            address: {
              type: 'array',
              items: { 
                $ref: '#/components/schemas/Address' 
              }
            }
          }
        },
        // 地址模型
        Address: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            phone: { type: 'string' },
            province: { type: 'string' },
            city: { type: 'string' },
            district: { type: 'string' },
            detail: { type: 'string' },
            isDefault: { type: 'boolean' }
          }
        },
        // 订单相关模型
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'integer' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'integer' },
                  name: { type: 'string' },
                  price: { type: 'string' },
                  image: { type: 'string' },
                  quantity: { type: 'integer' }
                }
              }
            },
            totalAmount: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
            status: { 
              type: 'string',
              enum: ['created', 'paid', 'shipped', 'delivered', 'completed', 'canceled'] 
            },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        // 分类模型
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            parentId: { type: 'string' }
          }
        },
        // 品牌模型
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string' }
          }
        },
        // 首页数据模型
        HomeData: {
          type: 'object',
          properties: {
            features: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  icon: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            hotProducts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            },
            carousel: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  image: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            newArrivals: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            },
            categories: {
              type: 'array',
              items: { $ref: '#/components/schemas/Category' }
            },
            upcomingProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  image: { type: 'string' },
                  releaseDate: { type: 'string' },
                  shortDescription: { type: 'string' },
                  countdown: { type: 'string' },
                  importance: { type: 'string' }
                }
              }
            }
          }
        },
        // 营销相关模型
        PromotionsData: {
          type: 'object',
          properties: {
            banners: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  image: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  link: { type: 'string' }
                }
              }
            },
            flashSales: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  price: { type: 'string' },
                  originalPrice: { type: 'string' },
                  image: { type: 'string' },
                  discount: { type: 'integer' },
                  soldPercentage: { type: 'integer' },
                  endTime: { type: 'string' }
                }
              }
            },
            coupons: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  amount: { type: 'number' },
                  minSpend: { type: 'number' },
                  scope: { type: 'string' },
                  validUntil: { type: 'string' },
                  status: { type: 'string' }
                }
              }
            },
            promotionProducts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        // 新品上市数据模型
        NewArrivalsData: {
          type: 'object',
          properties: {
            newArrivals: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            },
            featuredProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  price: { type: 'string' },
                  image: { type: 'string' },
                  shortDescription: { type: 'string' }
                }
              }
            },
            upcomingProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  image: { type: 'string' },
                  releaseDate: { type: 'string' },
                  shortDescription: { type: 'string' },
                  countdown: { type: 'string' },
                  importance: { type: 'string' }
                }
              }
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'] // API 文件的路径
};

const specs = swaggerJsdoc(options);

export default specs;