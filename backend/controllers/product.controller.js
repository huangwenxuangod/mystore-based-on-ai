import db from "../models/index.js";
const Product = db.products;
const Category = db.categories;
const Op = db.Sequelize.Op;

// 创建并保存新产品
const create = (req, res) => {
  // 验证请求
  if (!req.body.name || !req.body.price) {
    res.status(400).send({
      message: "产品名称和价格不能为空!"
    });
    return;
  }

  // 创建一个产品
  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    originalPrice: req.body.originalPrice,
    image: req.body.image,
    rating: req.body.rating || 0,
    reviewCount: req.body.reviewCount || 0,
    salesCount: req.body.salesCount || 0,
    isNew: req.body.isNew || false,
    discount: req.body.discount || 0,
    tag: req.body.tag,
    status: req.body.status || 'active',
    stock: req.body.stock || 0,
    categoryId: req.body.categoryId
  };

  // 保存产品到数据库
  Product.create(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "创建产品时出现错误。"
      });
    });
};

// 获取所有产品
const findAll = (req, res) => {
  const name = req.query.name;
  const categoryId = req.query.categoryId;
  const condition = {};

  if (name) {
    condition.name = { [Op.iLike]: `%${name}%` };
  }

  if (categoryId) {
    condition.categoryId = categoryId;
  }

  Product.findAll({
    where: condition,
    include: [{
      model: Category,
      as: "category"
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取产品时出现错误。"
      });
    });
};

// 根据ID查找单个产品
const findOne = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id, {
    include: [{
      model: Category,
      as: "category"
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `未找到ID为${id}的产品。`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `获取ID为${id}的产品时出现错误。`
      });
    });
};

// 更新产品
const update = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "产品更新成功。"
        });
      } else {
        res.send({
          message: `无法更新ID为${id}的产品。可能产品不存在或请求体为空!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `更新ID为${id}的产品时出现错误。`
      });
    });
};

// 删除产品
const remove = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "产品删除成功!"
        });
      } else {
        res.send({
          message: `无法删除ID为${id}的产品。可能产品不存在!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `删除ID为${id}的产品时出现错误。`
      });
    });
};

// 查找所有新产品
const findNewArrivals = (req, res) => {
  Product.findAll({
    where: { isNew: true },
    include: [{
      model: Category,
      as: "category"
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取新产品时出现错误。"
      });
    });
};

// 查找促销产品
const findPromotions = (req, res) => {
  Product.findAll({
    where: { discount: { [Op.gt]: 0 } },
    include: [{
      model: Category,
      as: "category"
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取促销产品时出现错误。"
      });
    });
};

// 获取热门产品
const findPopular = (req, res) => {
  Product.findAll({
    order: [['salesCount', 'DESC']],
    limit: 10,
    include: [{
      model: Category,
      as: "category"
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取热门产品时出现错误。"
      });
    });
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  findNewArrivals,
  findPromotions,
  findPopular
};