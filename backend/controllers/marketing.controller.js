import db from "../models/index.js";

const Product = db.products;
const Category = db.categories;

// 获取首页数据
const getHomeData = async (req, res) => {
  try {
    // 获取热门分类
    const categories = await Category.findAll({
      limit: 10
    });
    
    // 获取推荐商品
    const recommendedProducts = await Product.findAll({
      limit: 4,
      order: [
        ['createdAt', 'DESC']
      ]
    });
    
    // 获取轮播图数据
    const carousel = await getCarouselItems();
    
    res.status(200).send({
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || 'Shopping'
      })),
      recommendProducts: recommendedProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: `¥${product.price.toFixed(2)}`,
        image: product.image,
        rating: product.rating || 4.5,
        salesCount: product.salesCount || 0
      })),
      carousel,
      success: true
    });
  } catch (err) {
    res.status(500).send({ 
      message: err.message || "获取首页数据时出错", 
      success: false 
    });
  }
};

// 获取轮播图数据
const getCarouselData = async (req, res) => {
  try {
    const carouselItems = await getCarouselItems();
    res.status(200).send(carouselItems);
  } catch (err) {
    res.status(500).send({ 
      message: err.message || "获取轮播图数据时出错", 
      success: false 
    });
  }
};

// 辅助函数 - 获取轮播图项目
const getCarouselItems = async () => {
  // 这里应该从数据库中获取轮播图数据
  // 目前使用静态数据示例
  return [
    {
      id: 1,
      image: "https://picsum.photos/id/3/1200/400",
      title: "新品上市",
      description: "最新科技产品，限时优惠"
    },
    {
      id: 2,
      image: "https://picsum.photos/id/4/1200/400",
      title: "限时特惠",
      description: "全场商品8折起"
    },
    {
      id: 3,
      image: "https://picsum.photos/id/5/1200/400",
      title: "春季新品",
      description: "春季新品发布会，抢先体验"
    }
  ];
};

// 获取新品上市数据
const getNewArrivalsData = async (req, res) => {
  try {
    // 获取最新商品
    const newProducts = await Product.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 8
    });
    
    const banner = {
      image: "https://picsum.photos/id/21/1200/300",
      title: "新品上市",
      description: "抢先体验科技新品"
    };
    
    res.status(200).send({
      banner,
      products: newProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: `¥${product.price.toFixed(2)}`,
        image: product.image,
        releaseDate: product.createdAt.toISOString().split('T')[0],
        shortDescription: product.description ? product.description.substring(0, 50) : '',
        countdown: Math.floor(Math.random() * 30 + 1).toString() // 随机倒计时，实际应该从数据库中读取
      })),
      success: true
    });
  } catch (err) {
    res.status(500).send({ 
      message: err.message || "获取新品上市数据时出错", 
      success: false 
    });
  }
};

// 获取促销活动数据
const getPromotionsData = async (req, res) => {
  try {
    // 获取促销商品
    const promotionProducts = await Product.findAll({
      where: {
        discount: { [db.Sequelize.Op.gt]: 0 } // 有折扣的商品
      },
      limit: 8
    });
    
    const banner = {
      image: "https://picsum.photos/id/20/1200/300",
      title: "限时特惠",
      description: "全场低至5折"
    };
    
    res.status(200).send({
      banner,
      products: promotionProducts.map(product => {
        const originalPrice = product.price;
        const discount = product.discount || 10;
        const discountedPrice = originalPrice * (100 - discount) / 100;
        
        return {
          id: product.id,
          name: product.name,
          price: `¥${discountedPrice.toFixed(2)}`,
          originalPrice: `¥${originalPrice.toFixed(2)}`,
          discount,
          image: product.image,
          rating: product.rating || 4.5,
          salesCount: product.salesCount || 0
        };
      }),
      success: true
    });
  } catch (err) {
    res.status(500).send({ 
      message: err.message || "获取促销活动数据时出错", 
      success: false 
    });
  }
};

export default {
  getHomeData,
  getCarouselData,
  getNewArrivalsData,
  getPromotionsData
};