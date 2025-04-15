import db from "../models/index.js";
const Category = db.categories;
const Product = db.products;
const Op = db.Sequelize.Op;

// 创建并保存新分类
const create = (req, res) => {
  // 验证请求
  if (!req.body.name) {
    res.status(400).send({
      message: "分类名称不能为空!"
    });
    return;
  }

  // 创建一个分类
  const category = {
    name: req.body.name,
    icon: req.body.icon,
    description: req.body.description
  };

  // 保存分类到数据库
  Category.create(category)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "创建分类时出现错误。"
      });
    });
};

// 获取所有分类
const findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Category.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取分类时出现错误。"
      });
    });
};

// 根据ID查找单个分类
const findOne = (req, res) => {
  const id = req.params.id;

  Category.findByPk(id, {
    include: [{
      model: Product,
      as: "products"
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `未找到ID为${id}的分类。`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `获取ID为${id}的分类时出现错误。`
      });
    });
};

// 更新分类
const update = (req, res) => {
  const id = req.params.id;

  Category.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "分类更新成功。"
        });
      } else {
        res.send({
          message: `无法更新ID为${id}的分类。可能分类不存在或请求体为空!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `更新ID为${id}的分类时出现错误。`
      });
    });
};

// 删除分类
const remove = (req, res) => {
  const id = req.params.id;

  Category.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "分类删除成功!"
        });
      } else {
        res.send({
          message: `无法删除ID为${id}的分类。可能分类不存在!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `删除ID为${id}的分类时出现错误。`
      });
    });
};

// 获取分类及其产品
const findCategoryWithProducts = (req, res) => {
  Category.findAll({
    include: [{
      model: Product,
      as: "products"
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "获取分类及产品时出现错误。"
      });
    });
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  findCategoryWithProducts
};