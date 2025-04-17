// 商品类型
export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  salesCount?: number;
  description?: string;
  category?: string;
  stock?: number;
  brand?: string;
  reviews?: Review[];
}

// 评论类型
export interface Review {
  id: number;
  username: string;
  rating: number;
  content: string;
  date: string;
}

// 特色服务类型
export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

// 品牌类型
export interface Brand {
  id: number;
  name: string;
  logo: string;
}

// 首页数据类型
export interface HomeData {
  features: Feature[];
  hotProducts: Product[];
  newProducts: Product[];
  recommendedProducts: Product[];
  carousel: CarouselItem[];
}

// 轮播图类型
export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link?: string;
}

// 购物车商品类型
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  selected: boolean;
}

// 购物车数据类型
export interface CartData {
  items: CartItem[];
  total: string;
}

// 用户数据类型
export interface UserData {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: Address[];
}

// 地址类型
export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 订单类型
export interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  products: OrderProduct[];
}

// 订单商品类型
export interface OrderProduct {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
} 