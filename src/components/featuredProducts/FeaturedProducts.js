import React, { useState, useEffect } from 'react';
import styles from './FeaturedProducts.module.css';
import sendRequest from '../other/sendRequest';
import { serverDomain } from '../other/variables';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await sendRequest(`/api/products`);
        if (response.error) {
            console.log(response.error);
        } else {
            setProducts(response.products || []);
        }
    };

    const handleToggleFeatured = async (productId, currentStatus) => {
        try {
            const response = await sendRequest(`/api/products/featured`, 'PUT', {
                productId,
                featured: !currentStatus
            });

            if (!response.error) {
                setProducts(products.map(product =>
                    product._id === productId
                        ? { ...product, featured: !currentStatus }
                        : product
                ));
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.SKU?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestion des Produits en Vedette</h2>
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Rechercher par nom ou SKU"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Nom du Produit</th>
                        <th>SKU</th>
                        <th>Prix</th>
                        <th>En Vedette</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    src={product.images?.[0] || '/images/placeholder.png'}
                                    alt={product.productName}
                                    className={styles.productImage}
                                />
                            </td>
                            <td>{product.productName}</td>
                            <td>{product.SKU}</td>
                            <td>{product.price} DH</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={product.featured || false}
                                    onChange={() => handleToggleFeatured(product._id, product.featured)}
                                    className={styles.checkbox}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button
                    className={styles.buttons}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Précédent
                </button>
                <span className={styles.pageInfo}>Page {currentPage}</span>
                <button
                    className={styles.buttons}
                    disabled={indexOfLastProduct >= filteredProducts.length}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default FeaturedProducts;
