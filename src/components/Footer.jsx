import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">
              <span style={{ color: 'var(--accent-red)' }}>✦</span> DIECAST <span className="brand-badge">VAULT</span>
            </div>
            <p>
              The definitive vault for Hot Wheels Premium, Matchbox Collectors, 
              Real Riders™ rubber tire series, and authentic Metal/Metal™ diecast models.
            </p>
          </div>

          <div className="footer-col">
            <h4>Collector Lines</h4>
            <ul>
              <li><a href="#showcase">Car Culture & Modern Classics</a></li>
              <li><a href="#showcase">Matchbox 1 of 5000 Series</a></li>
              <li><a href="#showcase">Hot Wheels Elite & Red Line</a></li>
              <li><a href="#showcase">Mini GT 1:64 Precision</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Vault Collections</h4>
            <ul>
              <li><a href="#showcase">JDM Legends (Skyline, Supra)</a></li>
              <li><a href="#showcase">HW Exotics (Porsche, AMG ONE)</a></li>
              <li><a href="#showcase">Vintage Muscle (Charger, Cobra)</a></li>
              <li><a href="#showcase">Track Stars & LM Racers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Collector Guarantee</h4>
            <ul>
              <li><a href="#">Card & Bubble Protector Pack</a></li>
              <li><a href="#">Unpunched Mint Condition</a></li>
              <li><a href="#">Factory Sealed Cases</a></li>
              <li><a href="#">Authentic Mattel & Matchbox</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} DIECAST VAULT. Hot Wheels® & Matchbox® are registered trademarks of Mattel Inc.</div>
          <div>Built with React + Vite</div>
        </div>
      </div>
    </footer>
  )
}
