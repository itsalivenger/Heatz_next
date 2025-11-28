"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './PreviewProduct.module.css';
import sendRequest from '../../../components/other/sendRequest';
import { useSearchParams } from 'next/navigation';
import { addToCart, addToFavorite, getUser } from '../../../components/other/usefulFunctions';
import Popup from '../../../components/popup/popup';
import LazyMedia from '../../../components/lazyMedia/LazyMedia';
import { useTheme } from '../../../components/other/useTheme.js';
import { FaHeart } from 'react-icons/fa';

function PreviewProduct() {
  const [product, setProduct] = useState({});
  const [user, setUser] = useState({});
  const [content, setContent] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const _id = searchParams.get('_id');
  const { theme } = useTheme();

  useEffect(() => {
    const getItem = async () => {
      if (_id) {
        const response = await sendRequest(`/api/products/${_id}`, 'GET');
        if (response.error) {
          setContent({ title: 'Error', content: response.error });
          setIsOpen(true);
        } else {
          setProduct(response);
          if (typeof window !== 'undefined') {
            setUser(getUser());
          }
        }
      }
    }
    getItem();
  }, [_id]);

  const togglePopup = (content) => {
    setIsOpen(!isOpen);
    setContent(content)
  }

  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  return (
    <div className={`${styles["product-container"]} ${theme}`}>
      <div onClick={goBack} className={styles.goBackContainer}>
        <button className={`${styles["go-back"]} material-symbols-outlined`}>arrow_back</button>
      </div>
      <div className={styles["product-category"]}>
        {product.category}
      </div>
      <div className={styles["product-preview"]}>
        <div className={styles["image-carousel"]}>
          {product.imageUrls && product.imageUrls.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={product.imageUrls.length > 1}
              spaceBetween={10}
              slidesPerView={1}
              style={{ width: '100%' }}
            >
              {product.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <LazyMedia type="image" alt={`Vue ${index + 1} du produit`} className={styles["carousel-image"]} src={url} width={500} height={500} unoptimized={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className={styles["product-info"]}>
          <h1 className={styles["product-title"]}>{product && product.productName}</h1>
          <div className={styles["product-price"]}>{product.price} DH</div>

          <div className={styles["product-description"]}>
            <p className={styles["description-text"]}>
              {product.description}
            </p>
          </div>

          <div className={styles["product-features"]}>
            <h2 className={styles["features-title"]}>Caractéristiques Principales</h2>
            <ul className={styles["features-list"]}>
              {product.features && product.features.map((feature, index) => (
                <li key={index} className={styles["feature-item"]}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className={styles["product-actions"]}>
            <button className={`${styles["button"]} ${styles["button-cart"]}`} onClick={() => addToCart(user._id, togglePopup, product)}>
              Ajouter au Panier <span className='material-symbols-outlined'>shopping_cart</span>
            </button>
            <button
              onClick={() => addToFavorite(product._id, user._id, togglePopup)}
              className={`${styles["button"]} ${styles["button-wishlist"]}`}
            >
              Ajouter aux favoris <FaHeart size={24} color="white" />
            </button>
          </div>
        </div>
      </div>
      <Popup title={content.title} content={content.content} isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => { }} />
    </div>
  );
}

export default PreviewProduct;