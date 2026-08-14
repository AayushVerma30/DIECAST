import React from 'react'

export default function StatsSection() {
  const stats = [
    { number: "Metal/Metal™", label: "Full Diecast Chassis" },
    { number: "Real Riders™", label: "Soft Rubber Compound Tires" },
    { number: "1:64 Scale", label: "Pocket Precision Diecast" },
    { number: "100% Mint", label: "Sealed Blister Cards & Cases" }
  ]

  return (
    <section className="stats-banner">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-box">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
