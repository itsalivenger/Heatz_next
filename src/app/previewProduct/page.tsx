"use client";
import React, { Suspense, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './PreviewProduct.module.css';
import sendRequest from '../../components/other/sendRequest';
import { useSearchParams } from 'next/navigation';
import { addToCart, addToFavorite, getUser } from '../../components/other/usefulFunctions';
import Popup from '../../components/popup/popup';
import LazyMedia from '../../components/lazyMedia/LazyMedia';
import { useTheme } from '../../components/other/useTheme';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';

// This is your original component, now renamed.
function ProductPageContent() {
    const [product, setProduct] = useState<any>();
    const [user, setUser] = useState<any>();
    const [content, setContent] = useState({ title: '', content: '' });
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams(); // No colon 'any' needed here
    const _id = searchParams.get('_id');
    const { theme } = useTheme();

    useEffect(() => {
        const getItem = async () => {
            const response = await sendRequest(`/api/products/${_id}`, 'GET');
            if (response.error) {
                setContent({ title: 'Error', content: response.error });
                setIsOpen(true);
            } else {
                setProduct(response);
                setUser(getUser());
            }
        }
        if (_id) {
            getItem();
        }
    }, [_id]);

    // **FIX #2: Handle the initial loading state before trying to render anything.**
    // If product is not yet loaded, show a loading message and stop.
    if (!product) {
        return <div className={styles['loading-container']}>Loading...</div>;
    }

    const sliderSettings = {
        dots: true,
        infinite: product.imageUrls?.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        centerMode: false
    };

    const togglePopup = (content: any) => {
        setIsOpen(!isOpen);
        setContent(content);
    }

    return (
        <div className={`${styles["product-container"]} ${theme}`}>
            <div onClick={() => window.history.back()} className={styles.goBackContainer}>
                <button className={styles["go-back"]}>
                    <IoArrowBack size={24} />
                </button>
            </div>
            <div className={styles["product-category"]}>
                {product.category}
            </div>
            <div className={styles["product-preview"]}>
                <div className={styles["image-carousel"]}>
                    {/* Optional chaining (?.) adds safety here */}
                    {product.imageUrls?.length > 0 && (
                        <Slider {...sliderSettings}>
                            {product.imageUrls.map((url: string, index: number) => (
                                <div key={index} className={styles["carousel-slide"]}>
                                    <LazyMedia type="image" alt={`Vue ${index + 1} du produit`} className={styles["carousel-image"]} src={url} width={500} height={500} unoptimized={true} />
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>

                <div className={styles["product-info"]}>
                    <h1 className={styles["product-title"]}>{product.productName}</h1>
                    <div className={styles["product-price"]}>{product.price} DH</div>

                    <div className={styles["product-description"]}>
                        <p className={styles["description-text"]}>
                            {product.description}
                        </p>
                    </div>

                    <div className={styles["product-features"]}>
                        <h2 className={styles["features-title"]}>Caractéristiques Principales</h2>
                        <ul className={styles["features-list"]}>
                            {product.features?.map((feature: string, index: number) => (
                                <li key={index} className={styles["feature-item"]}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles["product-actions"]}>
                        <button className={`${styles["button"]} ${styles["button-cart"]}`} onClick={() => addToCart(user._id, togglePopup, product)}>
                            Ajouter au Panier <FaShoppingCart size={20} />
                        </button>
                        <button
                            onClick={() => addToFavorite(product._id, user._id, togglePopup)}
                            className={`${styles["button"]} ${styles["button-wishlist"]}`}
                        >
                            Ajouter aux favoris <FaHeart size={20} color="white" />
                        </button>
                    </div>
                </div>
            </div>
            <Popup onConfirm={() => setIsOpen(false)} title={content.title} content={content.content} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}

// **FIX #1: Create a new root component for the page that provides the Suspense boundary.**
export default function PreviewProductPage() {
    return (
        <Suspense fallback={<div className={styles['loading-container']}>Loading Page...</div>}>
            <ProductPageContent />
        </Suspense>
    );
}