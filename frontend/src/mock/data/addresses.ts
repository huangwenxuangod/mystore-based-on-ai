import Mock from 'mockjs'

// 定义地址数据接口
interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: boolean;
  postcode?: string;
  tag?: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟地址数据
Mock.mock('/api/addresses', 'get', (): { data: Address[]; success: boolean } => {
  const addresses: Address[] = [
    {
      id: 1,
      name: '张三',
      phone: '13812345678',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detailAddress: '三里屯SOHO 5号楼3层301',
      isDefault: true,
      postcode: '100020',
      tag: '家'
    },
    {
      id: 2,
      name: '张三',
      phone: '13812345678',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detailAddress: '张江高科技园区博云路2号',
      isDefault: false,
      postcode: '201203',
      tag: '公司'
    },
    {
      id: 3,
      name: '李四',
      phone: '13987654321',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detailAddress: '科技园南区T5栋',
      isDefault: false,
      postcode: '518057',
      tag: '其他'
    }
  ];

  return {
    data: addresses,
    success: true
  };
});

// 添加新地址
Mock.mock('/api/addresses', 'post', (options: any): { success: boolean; data: Address; message: string } => {
  const body = JSON.parse(options.body);
  
  // 模拟生成新地址
  const newAddress: Address = {
    id: Random.integer(10, 100), // 生成随机ID
    name: body.name,
    phone: body.phone,
    province: body.province,
    city: body.city,
    district: body.district,
    detailAddress: body.detailAddress,
    isDefault: body.isDefault || false,
    postcode: body.postcode,
    tag: body.tag
  };

  return {
    success: true,
    data: newAddress,
    message: '地址添加成功'
  };
});

// 更新地址
Mock.mock(/\/api\/addresses\/\d+$/, 'put', (options: any): { success: boolean; data: Address; message: string } => {
  const id = options.url.match(/\/addresses\/(\d+)/)[1];
  const body = JSON.parse(options.body);
  
  // 模拟更新地址
  const updatedAddress: Address = {
    id: parseInt(id),
    name: body.name,
    phone: body.phone,
    province: body.province,
    city: body.city,
    district: body.district,
    detailAddress: body.detailAddress,
    isDefault: body.isDefault || false,
    postcode: body.postcode,
    tag: body.tag
  };

  return {
    success: true,
    data: updatedAddress,
    message: '地址更新成功'
  };
});

// 删除地址
Mock.mock(/\/api\/addresses\/\d+$/, 'delete', (options: any): { success: boolean; message: string } => {
  const id = options.url.match(/\/addresses\/(\d+)/)[1];
  
  return {
    success: true,
    message: `地址(ID:${id})删除成功`
  };
});

export default Mock