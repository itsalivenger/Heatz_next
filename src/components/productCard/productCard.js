import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './productCard.module.css';
import { addToFavorite, addToCart } from "../other/usefulFunctions";
import LazyMedia from "../lazyMedia/LazyMedia";
import { useRouter } from 'next/navigation';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

const ProductCard = ({ product, user_id, togglePopup }) => {

  function reformatCloudinaryUrl(url) {
    const cloudinaryPattern = /https?:\/\/res\.cloudinary\.com\/.+\/image\/upload\/.+/;

    // Check if the URL is a Cloudinary URL
    // if (cloudinaryPattern.test(url)) {
    //     const parts = url.split('/upload/');
    //     // Add square transformations with quality set to best
    //     const transformations = 'c_fill,w_300,h_300,q_auto:best';
    //     return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    // }

    // If it's not a Cloudinary URL, return the original URL
    return url;
  }

  const shortenText = (text, maxLength = 100, suffix = '...') => {
    // Return original text if it's shorter than max length
    if (!text || text.length <= maxLength) {
      return text;
    }

    // Find the last space before maxLength to avoid cutting words
    const lastSpace = text.lastIndexOf(' ', maxLength);

    // If no space found, just cut at maxLength
    if (lastSpace === -1) {
      return text.substring(0, maxLength) + suffix;
    }

    // Cut at the last space and add suffix
    return text.substring(0, lastSpace) + suffix;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
    variableWidth: false
  };

  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/previewProduct?_id=${product._id}`)}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.imageContainer}>
        <Slider {...settings} className={styles.carousel}>
          {product.imageUrls && product.imageUrls.map((image, index) => (
            <div key={index} className={styles.carouselSlide}>
              <LazyMedia type="image" src={reformatCloudinaryUrl(image)} alt={`${product.productName} ${index + 1}`} className={styles.productImage} />
            </div>
          ))}
        </Slider>
        <div className={styles.iconsContainer}>
          <AiOutlineHeart
            onClick={e => { e.stopPropagation(); addToFavorite(product._id, user_id, togglePopup); }}
            className={`${styles.icon} ${styles.heartIcon}`}
            size={24}
          />
          <AiOutlineShoppingCart
            onClick={e => { e.stopPropagation(); addToCart(user_id._id, togglePopup, product); }}
            className={`${styles.icon} ${styles.cartIcon}`}
            size={24}
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.title}>{product.productName}</div>
        <p className={styles.note}>{product.note}</p>
        <p className={styles.description}>{shortenText(product.description)}</p>
        <p className={styles.price}>{product.price} DH</p>
      </div>
    </div>
  );
};

export default ProductCard;