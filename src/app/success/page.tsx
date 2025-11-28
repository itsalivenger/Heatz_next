import LazyMedia from '../../components/lazyMedia/LazyMedia';
import styles from './Success.module.css';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

function Success() {
    return (
        <div className={styles.success}>
            <div className={styles.container}>
                <section className={styles.orderConfirmation}>
                    <div className={styles.confirmationIcon}>
                        <FaCheckCircle size={48} color="green" />
                    </div>
                    <h1 className={styles.title}>Félicitations</h1>
                    <h2 className={styles.subtitle}>Votre commande est confirmée</h2>
                    <p className={styles.message}>Nous vous enverrons un e-mail de confirmation d'expédition.</p>
                    <div className={styles.actions}>
                        <Link href="/" className={styles.btn}>Retourner à l'accueil</Link>
                        <Link href="/boutique" className={styles.btn}>Explorer plus de produits</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Success;