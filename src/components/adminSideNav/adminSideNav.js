import { useCallback, useEffect, useState } from 'react';
import styles from './adminSideNav.module.css';
import DashboardAdmin from '../dashboardAdmin/dashboardAdmin';
import ProductManagement from '../ProductManagement/ProductManagement';
import OrdersAdmin from '../../app/ordersAdmin/page';
import AddProductForm from '../addProductForm/addProductForm';
import NewsletterDashboard from '../NewsletterDashboard/NewsletterDashboard';
import LazyMedia from '../lazyMedia/LazyMedia';
import HandleCoupons from '../handleCoupons/HandleCoupons';
import UserManagement from '../usersManagement/userManagement';
import FeaturedProducts from '../featuredProducts/FeaturedProducts';
import { MdMenu, MdDashboard, MdListAlt, MdExpandLess, MdExpandMore, MdAddShoppingCart, MdEditNote, MdLocalOffer, MdCampaign, MdDescription, MdInventory, MdPeople, MdStars } from 'react-icons/md';
import { FaBox } from 'react-icons/fa';
import { getUser } from '../other/usefulFunctions';



function AdminSideNav({ handleContent }) {
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const toggleSideNav = () => {
        setOpen(!open);
    }

    const [toggled, setToggled] = useState(false);
    const toggleProductsCrud = () => {
        setToggled(!toggled);
    }

    const stableHandleContent = useCallback(() => {
        handleContent(<DashboardAdmin />);
    }, [handleContent]);

    useEffect(() => {
        stableHandleContent();
        // Get current user to check role
        const user = getUser();
        setCurrentUser(user);
    }, []);

    return (
        <div className={`${styles.sidenav} ${open ? styles.open : ''}`}>
            <div onClick={toggleSideNav} className={`${styles.toggleButton} ${open ? styles.openMenu : ''}`}>
                <MdMenu className={`${styles.icon}`} />
            </div>

            <div className={styles.logo}>
                <LazyMedia type="image" src='/images/logos/HeatzLogo.png' alt='Heatz logo' className={styles.logoText} />
                <i className={`${styles.icon} material-symbols-outlined`}></i>
            </div>
            <nav className={styles.navMenu}>
                <div className={styles.navGroup}>
                    <a href="#orders" className={styles.navItem} onClick={() => { handleContent(<DashboardAdmin />) }}>
                        <MdDashboard className={`${styles.icon}`} />
                        <span>Dashboard</span>
                    </a>
                    <a href="#orders" className={styles.navItem} onClick={() => { handleContent(<OrdersAdmin />) }}>
                        <MdListAlt className={`${styles.icon}`} />
                        <span>Commandes</span>
                    </a>
                    <a onClick={() => { toggleProductsCrud() }} href="#products" className={styles.navItem}>
                        <MdInventory className={`${styles.icon}`} />
                        <span>Produits {toggled ? <MdExpandLess className={`${styles.icon}`} /> : <MdExpandMore className={`${styles.icon}`} />}</span>
                    </a>

                    <div className={`${styles.dropDown} ${toggled ? styles.toggled : ''}`}>
                        <a href="#products" className={styles.navItem} onClick={() => { handleContent(<AddProductForm />) }}>
                            <MdAddShoppingCart className={`${styles.icon}`} />
                            <span>Ajouter des Produits</span>
                        </a>
                        <a href="#products" className={styles.navItem} onClick={() => { handleContent(<ProductManagement />) }}>
                            <MdEditNote className={`${styles.icon}`} />
                            <span>Manager les Produits</span>
                        </a>
                    </div>

                    <a href="#promotions" className={styles.navItem} onClick={() => { handleContent(<HandleCoupons />) }}>
                        <MdLocalOffer className={`${styles.icon}`} />
                        <span>Promotions</span>
                    </a>
                    <a href="#analytics" className={styles.navItem} onClick={() => { handleContent(<NewsletterDashboard />) }}>
                        <MdCampaign className={`${styles.icon}`} />
                        <span>Promouvoir vos produits</span>
                    </a>
                    <a href="#featured" className={styles.navItem} onClick={() => { handleContent(<FeaturedProducts />) }}>
                        <MdStars className={`${styles.icon}`} />
                        <span>Produits en Vedette</span>
                    </a>
                    {(currentUser?.role === 'superadmin' || currentUser?.role === 'drendo') && (
                        <a href="#statements" className={`${styles.navItem}`} onClick={() => { handleContent(<UserManagement />) }}>
                            <MdPeople className={`${styles.icon}`} />
                            <span>Management des utilisateurs</span>
                        </a>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default AdminSideNav;