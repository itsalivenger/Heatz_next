"use client"
import { useEffect, useState } from "react";
import sendRequest from "../components/other/sendRequest";
import HeroSection from "../components/heroSection/HeroSection";
import HeroCarousel from "../components/heroCarousel/herocarousel";
// import { serverDomain } from "../components/other/variables";
// import LoadingSpinner from "../components/LoadingSpinner/loadingSpinner";
import LazyMedia from "@/components/lazyMedia/LazyMedia.js";
import { useTheme } from '../components/other/useTheme';
import ColoredDivider from "../components/coloredHr/coloredDivider";
import TitleAndText from "../components/TitleAndText/TitleAndText";
// import ImageAndVideo from "../components/ImageAndVideo/imageAndVideo";
import ProductsCardsCarousel from "../components/ProductsCardsCarousel/productsCardsCarousel";
import ProductsCarousel from "../components/ProductsCarousel/productsCarousel";
import VideoCarousel from "../components/ImageGallery/videoCarousel";
import Popup from "../components/popup/popup";
import HomeCategories from "../components/homeCategories/homeCategories";
import ShippingFeatures from "../components/shippingFeature/shippingFeature";

interface PopupContent {
  title?: string;
  content?: string;
}

function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [shippingProducts, setShippingProducts] = useState<any[]>([]);
  const [shippingActiveTab, setShippingActiveTab] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [trendingActiveTab, setTrendingActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<PopupContent>({});
  const { theme } = useTheme();

  const shippingCategories = ['Câbles', 'Écouteurs', 'Chargeurs', 'Offres 10%'];
  const trendingCategories = ['Casque', 'Souris', 'Clavier', 'Offres 10%'];

  useEffect(() => {
    const getProductsSamples = async () => {
      const response = await sendRequest(`/api/products/carouselSamples`, 'GET');
      if (response.error) {
        console.log(response.error);
      } else {
        setProducts(response.products ? response.products : []);
      }
    }

    getProductsSamples();
    handleShippingTabChange(0); // Fetch initial products for first tab
    handleTrendingTabChange(0); // Fetch initial products for second tab
  }, []);

  const handleShippingTabChange = async (index: number) => {
    setShippingActiveTab(index);

    // Logic for "Offres 10%" - fetch featured products
    if (index === 3) {
      const response = await sendRequest(`/api/products/featured`, 'GET');
      if (response.error) {
        console.log(response.error);
        setShippingProducts([]);
      } else {
        setShippingProducts(response.products || []);
      }
      return;
    }

    // For other tabs, search by category
    let category = shippingCategories[index];
    const response = await sendRequest(`/api/products/search`, 'POST', { searchVal: category });

    if (response.error) {
      console.log(response.error);
      setShippingProducts([]);
    } else {
      setShippingProducts(Array.isArray(response) ? response : []);
    }
  };

  const handleTrendingTabChange = async (index: number) => {
    setTrendingActiveTab(index);

    // Logic for "Offres 10%" - fetch featured products
    if (index === 3) {
      const response = await sendRequest(`/api/products/featured`, 'GET');
      if (response.error) {
        console.log(response.error);
        setTrendingProducts([]);
      } else {
        setTrendingProducts(response.products || []);
      }
      return;
    }

    // For other tabs, search by category
    let category = trendingCategories[index];
    const response = await sendRequest(`/api/products/search`, 'POST', { searchVal: category });

    if (response.error) {
      console.log(response.error);
      setTrendingProducts([]);
    } else {
      setTrendingProducts(Array.isArray(response) ? response : []);
    }
  };

  const togglePopup = (popupContent: PopupContent) => {
    setIsOpen(!isOpen);
    setContent(popupContent);
  }

  return (
    <div className={theme}>

      <HeroSection />
      <HomeCategories />
      <TitleAndText
        title={"Améliorez Votre Expérience de Jeu"}
        text={`Découvrez nos produits de pointe conçus pour une immersion totale et des performances optimales. Profitez d'un son immersif, d'une précision accrue, et d'un confort exceptionnel.`}
      />
      <HeroCarousel />
      <ShippingFeatures />
      <ProductsCardsCarousel
        categories={shippingCategories}
        activeTab={shippingActiveTab}
        onTabChange={handleShippingTabChange}
      />
      <ProductsCarousel togglePopup={togglePopup} products={shippingProducts.length ? shippingProducts : []} />
      <ColoredDivider />
      <LazyMedia src={null} type="image" img={"/images/flayers/gaming.jpeg"} vid={"https://res.cloudinary.com/dkhvdihhj/video/upload/v1739022957/watchLast_rd2hpb.mp4"} />
      <TitleAndText
        title={"Améliorez Votre Expérience de Jeu"}
        text={`Optimisez votre expérience de jeu avec des accessoires performants, des casques audio immersifs et des périphériques conçus pour offrir précision et confort lors de vos sessions gaming.`}
      />
      <HeroCarousel />
      <ProductsCardsCarousel
        categories={trendingCategories}
        activeTab={trendingActiveTab}
        onTabChange={handleTrendingTabChange}
      />
      <ProductsCarousel togglePopup={togglePopup} products={trendingProducts.length ? trendingProducts : []} />
      <ColoredDivider />
      <LazyMedia src={null} type="image" img={"/images/flayers/watch.jpeg"} vid={"https://res.cloudinary.com/dkhvdihhj/video/upload/v1739022991/hero2_cryi01.mp4"} />
      <TitleAndText
        title={"Produits Tendance"}
        text={`Découvrez notre sélection de produits innovants, des accessoires tech de qualité pour améliorer votre quotidien.`}
      />
      <Popup onClose={() => setIsOpen(false)} isOpen={isOpen} content={content.content} title={content.title} onConfirm={() => { }} />
      <VideoCarousel />

    </div>
  );
}

export default Home;