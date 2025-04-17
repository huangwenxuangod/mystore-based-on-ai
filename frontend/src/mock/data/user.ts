import Mock from 'mockjs'

// 定义用户相关接口
export interface User {
  id: number;
  username: string;
  email: string;
  realName?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  memberLevel?: number;
  memberPoints?: number;
  registerDate?: string;
  lastLoginDate?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings?: {
    shareProfile: boolean;
    showActivity: boolean;
  };
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  tag?: string;
}

interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordUpdateResponse {
  status: number;
  message: string;
  success: boolean;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 用户数据
const userData: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  realName: '测试用户',
  phone: '13800138000',
  gender: '男',
  birthday: '1990-01-01',
  avatar: 'https://picsum.photos/id/105/200/200',
  memberLevel: 2,
  memberPoints: 1250,
  registerDate: '2023-01-15',
  lastLoginDate: '2025-04-16',
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    privacySettings: {
      shareProfile: true,
      showActivity: false
    }
  }
};

// 收货地址数据
const addressList: Address[] = [
  {
    id: 1,
    name: '张小明',
    phone: '13812345678',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南路88号智汇大厦3栋1001室',
    isDefault: true,
    tag: '公司'
  },
  {
    id: 2,
    name: '张小明',
    phone: '13812345678',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detail: '天河路385号太古汇1期北塔12楼',
    isDefault: false,
    tag: '家庭'
  }
];

// 获取用户信息
Mock.mock('/api/users/profile', 'get', (): { user: User; success: boolean } => {
  return {
    user: userData,
    success: true
  };
});

// 更新用户信息
Mock.mock('/api/users/profile', 'put', (options: any): { user: User; message: string; success: boolean } => {
  const updateData = JSON.parse(options.body);
  Object.assign(userData, updateData);
  return {
    user: userData,
    message: '用户信息更新成功',
    success: true
  };
});

// 更新密码
Mock.mock('/api/users/password', 'put', (options: any): PasswordUpdateResponse => {
  const { currentPassword, newPassword, confirmPassword } = JSON.parse(options.body) as PasswordUpdateRequest;
  
  // 模拟密码验证
  if (currentPassword !== '123456') {
    return {
      status: 400,
      message: '当前密码错误',
      success: false
    };
  }
  
  if (newPassword !== confirmPassword) {
    return {
      status: 400,
      message: '两次输入密码不一致',
      success: false
    };
  }
  
  if (newPassword.length < 6) {
    return {
      status: 400,
      message: '密码长度不能少于6位',
      success: false
    };
  }
  
  return {
    status: 200,
    message: '密码修改成功',
    success: true
  };
});

// 获取用户收货地址
Mock.mock('/api/users/addresses', 'get', (): { addresses: Address[]; success: boolean } => {
  return {
    addresses: addressList,
    success: true
  };
});

// 添加收货地址
Mock.mock('/api/users/addresses', 'post', (options: any): { address: Address; message: string; success: boolean } => {
  const addressData = JSON.parse(options.body);
  const newId = Math.max(...addressList.map(item => item.id), 0) + 1;
  
  const newAddress: Address = {
    id: newId,
    ...addressData
  };
  
  // 如果设置为默认地址，则将其他地址更新为非默认
  if (newAddress.isDefault) {
    addressList.forEach(item => {
      if (item.id !== newAddress.id) {
        item.isDefault = false;
      }
    });
  }
  
  addressList.push(newAddress);
  
  return {
    address: newAddress,
    message: '地址添加成功',
    success: true
  };
});

// 更新收货地址
Mock.mock(/\/api\/users\/addresses\/\d+/, 'put', (options: any): { address: Address; message: string; success: boolean } => {
  const id = parseInt(options.url.match(/\/addresses\/(\d+)/)[1]);
  const addressData = JSON.parse(options.body);
  const index = addressList.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const updatedAddress: Address = {
      ...addressList[index],
      ...addressData
    };
    
    // 如果设置为默认地址，则将其他地址更新为非默认
    if (updatedAddress.isDefault) {
      addressList.forEach(item => {
        if (item.id !== updatedAddress.id) {
          item.isDefault = false;
        }
      });
    }
    
    addressList[index] = updatedAddress;
    
    return {
      address: updatedAddress,
      message: '地址更新成功',
      success: true
    };
  }
  
  return {
    address: {} as Address,
    message: '地址不存在',
    success: false
  };
});

// 删除收货地址
Mock.mock(/\/api\/users\/addresses\/\d+/, 'delete', (options: any): { id: number; message: string; success: boolean } => {
  const id = parseInt(options.url.match(/\/addresses\/(\d+)/)[1]);
  const index = addressList.findIndex(item => item.id === id);
  
  if (index !== -1) {
    addressList.splice(index, 1);
    
    // 如果删除的是默认地址，则将第一个地址设为默认地址
    if (addressList.length > 0 && !addressList.some(item => item.isDefault)) {
      addressList[0].isDefault = true;
    }
    
    return {
      id,
      message: '地址删除成功',
      success: true
    };
  }
  
  return {
    id,
    message: '地址不存在',
    success: false
  };
});

// 用户登录
Mock.mock('/api/users/login', 'post', (options: any): { token?: string; user?: User; message: string; success: boolean } => {
  const { username, password } = JSON.parse(options.body);
  
  if (username === 'testuser' && password === '123456') {
    return {
      token: 'mock_token_' + Date.now(),
      user: userData,
      message: '登录成功',
      success: true
    };
  } else {
    return {
      message: '用户名或密码错误',
      success: false
    };
  }
});

// 用户注册
Mock.mock('/api/users/register', 'post', (options: any): { token?: string; user?: User; message: string; success: boolean } => {
  const userInfo = JSON.parse(options.body);
  
  // 简单验证
  if (!userInfo.username || !userInfo.password || !userInfo.email) {
    return {
      message: '请填写完整注册信息',
      success: false
    };
  }
  
  // 模拟注册成功
  const newUser: User = {
    id: Random.integer(1000, 9999),
    username: userInfo.username,
    email: userInfo.email,
    avatar: `https://picsum.photos/id/${Random.integer(1, 200)}/200/200`,
    registerDate: new Date().toISOString().split('T')[0],
    lastLoginDate: new Date().toISOString().split('T')[0],
    memberLevel: 1,
    memberPoints: 100
  };
  
  return {
    token: 'mock_token_' + Date.now(),
    user: newUser,
    message: '注册成功',
    success: true
  };
});

// 退出登录
Mock.mock('/api/users/logout', 'post', (): { message: string; success: boolean } => {
  return {
    message: '退出成功',
    success: true
  };
});

// 获取用户会员信息
Mock.mock('/api/users/membership', 'get', () => {
  return {
    membership: {
      level: userData.memberLevel,
      points: userData.memberPoints,
      nextLevel: userData.memberLevel! + 1,
      pointsToNextLevel: 1000,
      benefits: [
        '专享折扣',
        '生日礼包',
        '免邮特权',
        '专属客服'
      ],
      history: [
        {
          id: 1,
          date: '2025-04-10',
          type: '购物',
          points: 200,
          description: '购物获得积分'
        },
        {
          id: 2,
          date: '2025-03-15',
          type: '评价',
          points: 50,
          description: '商品评价获得积分'
        }
      ]
    },
    success: true
  };
});

// 获取用户购物记录
Mock.mock('/api/users/shopping-history', 'get', () => {
  return {
    history: [
      {
        date: '2025-04-10',
        products: [
          {
            id: 1,
            name: '智能手表',
            price: '¥599.00',
            image: 'https://picsum.photos/id/2/100/100'
          },
          {
            id: 2,
            name: '无线蓝牙耳机',
            price: '¥299.00',
            image: 'https://picsum.photos/id/1/100/100'
          }
        ]
      },
      {
        date: '2025-03-15',
        products: [
          {
            id: 3,
            name: '机械键盘',
            price: '¥499.00',
            image: 'https://picsum.photos/id/60/100/100'
          }
        ]
      }
    ],
    success: true
  };
});