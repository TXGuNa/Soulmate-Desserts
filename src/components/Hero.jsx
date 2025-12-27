import React from 'react';
import { useTranslation } from '../context/TranslationContext';

const Hero = ({ onNavigate, heroProduct }) => {
  const { t } = useTranslation();
  const defaultImage = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800";
  const heroImage = heroProduct?.images?.[0] || defaultImage;

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{t('heroTitle')} <em>{t('heroTitleEmphasis')}</em></h1>
          <p>{t('heroDescription')}</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>{t('exploreCreations')}</button>
            <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>{t('customOrders')}</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <img src={heroImage} alt="Cake" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
