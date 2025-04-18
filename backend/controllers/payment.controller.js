import db from "../models/index.js";

const Order = db.orders;

// 支付相关的临时存储(实际生产环境应该使用数据库存储)
const paymentStatusMap = new Map();

// 获取支付状态
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // 获取支付状态(实际生产环境应该从数据库或支付服务提供商API获取)
    const status = paymentStatusMap.get(paymentId) || 'pending';
    
    res.status(200).send({
      paymentId,
      status,
      message: `支付${status === 'completed' ? '已完成' : '处理中'}`,
      success: true
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取支付状态时出错",
      success: false
    });
  }
};

// 完成支付
const completePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // 检查支付ID是否有效
    if (!paymentId) {
      return res.status(400).send({
        message: "支付ID不能为空",
        success: false
      });
    }
    
    // 更新支付状态为已完成(实际环境中应该更新数据库)
    paymentStatusMap.set(paymentId, 'completed');
    
    // 获取关联的订单ID (这里示例，实际应该从数据库查询)
    const orderId = paymentId.split('_')[1];
    
    // 如果有关联订单，更新订单状态
    if (orderId) {
      try {
        // 更新订单状态为已支付
        await Order.update(
          { status: 'paid', paymentMethod: 'online' },
          { where: { id: orderId } }
        );
      } catch (orderErr) {
        console.error("更新订单状态失败:", orderErr);
      }
    }
    
    res.status(200).send({
      paymentId,
      status: 'completed',
      message: "支付已成功完成",
      success: true
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "完成支付时出错",
      success: false
    });
  }
};

// 发起支付
const initiatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    
    // 获取订单信息
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send({
        message: "订单不存在",
        success: false
      });
    }
    
    // 生成支付ID (实际环境中应该通过支付服务提供商获取)
    const paymentId = `pay_${orderId}_${Date.now()}`;
    
    // 初始化支付状态
    paymentStatusMap.set(paymentId, 'pending');
    
    // 实际环境中，这里应该调用支付服务提供商API发起支付
    
    // 返回支付信息
    res.status(200).send({
      paymentId,
      orderId,
      amount: order.totalAmount,
      paymentMethod,
      status: 'pending',
      paymentUrl: `/payment/${paymentId}`, // 前端支付页面的URL
      message: "支付已发起，请完成支付",
      success: true
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "发起支付时出错",
      success: false
    });
  }
};

export default {
  getPaymentStatus,
  completePayment,
  initiatePayment
};