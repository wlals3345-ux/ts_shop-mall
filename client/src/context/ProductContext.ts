import type { Product, NewProduct } from "../types/product";
import { createContext, useContext } from "react";

// 상품 컨텍스트 타입 정의
// 서버에 저장하므로 끝날 때까지 기다릴 수 있게 함수들이 Promise를 돌려줍니다.
interface ProductContextType {
  products: Product[];
  addProduct: (newProduct: NewProduct) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
}

// 상품 컨텍스트 생성
export const ProductContext = createContext<ProductContextType | null>(null);

// 상품 컨텍스트 커스텀 훅
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct는 ProductProvider 내부에서만 사용 가능합니다.");
  }
  return context;
};