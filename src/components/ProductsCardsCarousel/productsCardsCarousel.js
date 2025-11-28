import TabNavigation from "./tabNavigation";
import styles from './productsCardsCarousel.module.css';
import ViewAllButton from "./ViewAllButton";

function ProductsCardsCarousel({ categories, activeTab, onTabChange }) {
    return (
        <div>
            <div className={styles["navigationContainer"]}>
                <TabNavigation tabs={categories} activeTab={activeTab} onTabChange={onTabChange} />
                <ViewAllButton text="Voir Tout" onClick={() => { window.location.href = '/boutique' }} />
            </div>
        </div>
    );
}

export default ProductsCardsCarousel;