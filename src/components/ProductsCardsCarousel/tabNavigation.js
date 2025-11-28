import styles from './tabNavigation.module.css';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;