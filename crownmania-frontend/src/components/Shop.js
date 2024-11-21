// src/components/Shop.js
import React, { useState, useEffect } from 'react';
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: process.env.REACT_APP_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    client.product.fetchAll().then((fetchedProducts) => {
      setProducts(fetchedProducts);
    });
  }, []);

  const addToCart = async (productId) => {
    const checkout = await client.checkout.create();
    const lineItemsToAdd = [
      {
        variantId: productId,
        quantity: 1,
      },
    ];
    const newCheckout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
    window.location.href = newCheckout.webUrl;
  };

  return (
    <div>
      <h1>Shop</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product.id.toString()} className="product">
            <h3>{product.title}</h3>
            <img src={product.images[0]?.src} alt={product.title} width="200" />
            <p>{product.description}</p>
            <button onClick={() => addToCart(product.variants[0].id)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;