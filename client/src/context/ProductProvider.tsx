import React, { useEffect, useState } from "react";
import type { Product, NewProduct } from "../types/product";
import { ProductContext } from "./ProductContext";
import { createProduct, deleteProduct, getProducts, modifyProduct } from "../api/product";

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  // 처음에는 빈 배열로 시작하고, 서버에서 받아 오면 채웁니다.
  const [products, setProducts] = useState<Product[]>([]);

  // 화면이 처음 그려질 때 한 번 상품 목록을 불러옵니다.
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.log('상품 목록 조회 오류!', err));
  }, []);

  // 상품 추가: 서버에 등록한 뒤, 서버가 만든 id를 받기 위해 목록을 다시 불러옵니다.
  const addProduct = async (newProduct: NewProduct) => {
    await createProduct(newProduct);
    setProducts(await getProducts());
  };

  // 상품 삭제: 서버에서 지운 뒤, 화면 목록에서도 뺍니다.
  const removeProduct = async (productId: number) => {
    await deleteProduct(productId);
    setProducts(products.filter((product) => product.id !== productId));
  };

  // 상품 수정: 서버에서 고친 뒤, 화면 목록에서도 같은 id의 상품을 바꿉니다.
  const updateProduct = async (updatedProduct: Product) => {
    await modifyProduct(updatedProduct);
    setProducts(products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;