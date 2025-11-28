import React, { useState, useEffect } from 'react';
import styles from './searchBar.module.css';
import LazyMedia from '../lazyMedia/LazyMedia';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';

const SearchBar = ({ toggleSearchInput, isActive, handleSubmit }) => {
    const [searchVal, setSearchVal] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const handleSearch = async () => {
        if (searchVal.trim().length > 0) {
            try {
                const results = await handleSubmit(searchVal);
                setSearchResults(results);
                setIsDropDownOpen(true);
            } catch (error) {
                console.error('Search failed:', error);
            }
        } else {
            setSearchResults([]);
            setIsDropDownOpen(false);
        }
    };

    const handleTyping = (val) => {
        setSearchVal(val);

        // Clear any existing debounce timer
        if (typingTimeout) clearTimeout(typingTimeout);

        // Debounce the search to reduce API calls
        const timeout = setTimeout(() => {
            handleSearch();
        }, 300);
        setTypingTimeout(timeout);
    };

    const handleItemClick = (product) => {
        // Navigate to the product page
        window.location.href = `/previewProduct?_id=${product._id}`;
    };

    const handleClose = () => {
        setSearchVal('');
        setSearchResults([]);
        setIsDropDownOpen(false);
        toggleSearchInput();
    };

    useEffect(() => {
        // Cleanup debounce timer on unmount
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [typingTimeout]);

    return (
        <div>
            <div className={`${styles.searchBarContainer} ${isActive ? styles.active : ''}`}>
                <div className={styles.searchBar}>
                    <div onClick={handleClose} className={`${styles['closeIcon']} ${styles.icons}`}>
                        <AiOutlineClose />
                    </div>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Rechercher un produit par: Nom, Marque, Catégorie ou SKU..."
                        onChange={(e) => handleTyping(e.target.value)}
                        value={searchVal}
                    />
                    <div onClick={handleSearch} className={`${styles['searchIcon']} ${styles.icons}`}>
                        <AiOutlineSearch />
                    </div>
                </div>
            </div>
            {/* Render dropdown only when there are results and search is active */}
            {isDropDownOpen && searchResults.length > 0 && searchVal.trim() && (
                <div className={styles.searchResultsDropdown}>
                    {searchResults.map((product, index) => (
                        <SearchResultItem
                            key={product._id || index}
                            product={product}
                            onClick={handleItemClick}
                        />
                    ))}
                    <div onClick={() => setIsDropDownOpen(false)} className={styles.overlay}></div>
                </div>
            )}
        </div>
    );
};

const SearchResultItem = ({ product, onClick }) => {
    return (
        <div className={styles.resultItem} onClick={() => onClick(product)}>
            <LazyMedia type="image" className={styles.resultImage} src={product.imageUrls?.[0] || '/images/products/item_view0.jpg'} alt={product.productName} width={50} height={50} unoptimized={true} />
            <span className={styles.resultName}>{product.productName}</span>
        </div>
    );
};

export default SearchBar;
