"use client"
import { useEffect, useState } from "react";
import sendRequest from "../components/other/sendRequest";
import HeroSection from "../components/heroSection/HeroSection";
import HeroCarousel from "../components/heroCarousel/herocarousel";
import { useTheme } from '../components/other/useTheme';
import ColoredDivider from "../components/coloredHr/coloredDivider";
import TitleAndText from "../components/TitleAndText/TitleAndText";
import ProductsCardsCarousel from "../components/ProductsCardsCarousel/productsCardsCarousel";
import ProductsCarousel from "../components/ProductsCarousel/productsCarousel";
import VideoCarousel from "../components/ImageGallery/videoCarousel";
import Popup from "../components/popup/popup";
import HomeCategories from "../components/homeCategories/homeCategories";
import ShippingFeatures from "../components/shippingFeature/shippingFeature";
import LazyMedia from "../components/lazyMedia/LazyMedia";

interface PopupContent {
  title?: string;
  content?: string;
}

function Home() {
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
    handleShippingTabChange(0);
    handleTrendingTabChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShippingTabChange = async (index: number) => {
    setShippingActiveTab(index);

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

    const category = shippingCategories[index];
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

    const category = trendingCategories[index];
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
      <LazyMedia type="video" src="https://res.cloudinary.com/dkhvdihhj/video/upload/v1739022957/watchLast_rd2hpb.mp4" poster="/images/flayers/gaming.jpeg" style={{ width: '50%', height: 'auto', margin: '0 auto', display: 'block' }} alt="Gaming Video" />
      <TitleAndText
        title={"Améliorez Votre Expérience de Jeu"}
        text={`Optimisez votre expérience de jeu avec des accessoires performants, des casques audio immersifs et des périphériques conçus pour offrir précision et confort lors de vos sessions gaming.`}
      />
      <HeroCarousel />
      <ProductsCardsCarousel
        categories={shippingCategories}
        activeTab={shippingActiveTab}
        onTabChange={handleShippingTabChange}
      />
      <ProductsCarousel togglePopup={togglePopup} products={shippingProducts.length ? shippingProducts : []} />
      <ColoredDivider />
      <LazyMedia type="video" src="https://res.cloudinary.com/dkhvdihhj/video/upload/v1739022991/hero2_cryi01.mp4" poster="/images/flayers/watch.jpeg" style={{ width: '80%', height: 'auto', margin: '0 auto', display: 'block' }} alt="Watch Video" />
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