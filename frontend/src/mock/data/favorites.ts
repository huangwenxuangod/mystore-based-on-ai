import Mock from 'mockjs'

// 定义收藏夹数据接口
interface FavoriteItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: number;
  image: string;
  description?: string;
  category?: string;
  addTime?: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟收藏夹数据
Mock.mock('/api/favorites', 'get', (): { data: FavoriteItem[]; success: boolean } => {
  const favorites: FavoriteItem[] = [
    {
      id: 1,
      productId: 1,
      name: '无线蓝牙耳机',
      price: '¥299.00',
      originalPrice: '¥399.00',
      discount: 25,
      image: 'https://picsum.photos/id/1/300/300',
      description: '高音质无线蓝牙耳机，支持主动降噪，续航长达24小时',
      category: '数码产品',
      addTime: '2025-03-10'
    },
    {
      id: 2,
      productId: 4,
      name: '降噪耳机',
      price: '¥799.00',
      originalPrice: '¥999.00',
      discount: 20,
      image: 'https://picsum.photos/id/62/300/300',
      description: '专业级降噪耳机，支持Hi-Res音质，续航30小时',
      category: '数码产品',
      addTime: '2025-03-15'
    },
    {
      id: 3,
      productId: 7,
      name: '4K高清投影仪',
      price: '¥3999.00',
      originalPrice: '¥4999.00',
      discount: 20,
      image: 'https://picsum.photos/id/30/300/300',
      description: '4K超高清投影仪，支持HDR，亮度2000流明',
      category: '影音设备',
      addTime: '2025-03-20'
    },
    {
      id: 4,
      productId: 12,
      name: '游戏鼠标',
      price: '¥199.00',
      originalPrice: '¥249.00',
      discount: 20,
      image: 'https://picsum.photos/id/66/300/300',
      description: '电竞游戏鼠标，16000DPI，RGB背光',
      category: '电脑配件',
      addTime: '2025-04-01'
    }
  ];

  return {
    data: favorites,
    success: true
  };
});

// 添加到收藏
Mock.mock('/api/favorites', 'post', (options: any): { success: boolean; message: string } => {
  const body = JSON.parse(options.body);
  const productId = body.productId;

  return {
    success: true,
    message: `商品(ID:${productId})已成功添加到收藏夹`
  };
});

// 从收藏夹删除
Mock.mock(/\/api\/favorites\/\d+$/, 'delete', (options: any): { success: boolean; message: string } => {
  const id = options.url.match(/\/favorites\/(\d+)/)[1];

  return {
    success: true,
    message: `已从收藏夹中移除商品(ID:${id})`
  };
});

export default Mock