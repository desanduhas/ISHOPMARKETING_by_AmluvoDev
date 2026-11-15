import React from 'react';
import mapData from './srilanka_map_path.json';
import './sri-lanka-map.css';

interface CityInfo {
  name: string;
  tag: string;
  x: number;
  y: number;
  isHq?: boolean;
  labelAlign: 'left' | 'right' | 'top' | 'bottom';
  pulseClass: string;
}

const cities: CityInfo[] = [
  {
    name: 'COLOMBO',
    tag: 'HQ & STUDIO',
    x: mapData.cities.Colombo[0], // 79.1
    y: mapData.cities.Colombo[1], // 349.0
    isHq: true,
    labelAlign: 'left',
    pulseClass: 'pulse-delay-1',
  },
  {
    name: 'KANDY',
    tag: 'CENTRAL HUB',
    x: mapData.cities.Kandy[0], // 184.2
    y: mapData.cities.Kandy[1], // 310.0
    labelAlign: 'bottom',
    pulseClass: 'pulse-delay-2',
  },
  {
    name: 'ANURADHAPURA',
    tag: 'NORTH CENTRAL',
    x: mapData.cities.Anuradhapura[0], // 152.9
    y: mapData.cities.Anuradhapura[1], // 200.5
    labelAlign: 'left',
    pulseClass: 'pulse-delay-3',
  },
  {
    name: 'POLONNARUWA',
    tag: 'EASTERN GATEWAY',
    x: mapData.cities.Polonnaruwa[0], // 236.6
    y: mapData.cities.Polonnaruwa[1], // 240.3
    labelAlign: 'right',
    pulseClass: 'pulse-delay-4',
  },
];

export default function SriLankaMap() {
  return (
    <div className="sl-map-container" aria-label="Sri Lanka Regional Operational Map">
      <div className="sl-map-svg-wrapper">
        <svg
          className="sl-map-svg"
          viewBox="15 20 360 450"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="slIslandGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c5a059" stopOpacity="0.22" />
              <stop offset="65%" stopColor="#c5a059" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ethereal Gold Ambient Halo behind Island */}
          <ellipse cx="190" cy="270" rx="130" ry="170" fill="url(#slIslandGlow)" />

          {/* Animated Connecting Flight / Transit Routes */}
          {/* Colombo -> Anuradhapura */}
          <path
            className="sl-route-line"
            d={`M ${cities[0].x} ${cities[0].y} Q 105 270 ${cities[2].x} ${cities[2].y}`}
          />
          {/* Colombo -> Kandy */}
          <path
            className="sl-route-line"
            d={`M ${cities[0].x} ${cities[0].y} Q 135 342 ${cities[1].x} ${cities[1].y}`}
          />
          {/* Kandy -> Polonnaruwa */}
          <path
            className="sl-route-line"
            d={`M ${cities[1].x} ${cities[1].y} Q 215 285 ${cities[3].x} ${cities[3].y}`}
          />
          {/* Anuradhapura -> Polonnaruwa */}
          <path
            className="sl-route-line"
            d={`M ${cities[2].x} ${cities[2].y} Q 195 212 ${cities[3].x} ${cities[3].y}`}
          />

          {/* Sri Lanka Landmass Coastline (Vector Path) */}
          <path
            className="sl-island-path"
            d={mapData.path}
          />

          {/* 4 City Markers with Pulsing Radar & Golden Pins */}
          {cities.map((city) => (
            <g key={city.name} className="sl-city-pin">
              {/* Radar Pulse Wave */}
              <circle
                cx={city.x}
                cy={city.y}
                r="10"
                fill="none"
                stroke="#c5a059"
                className={`sl-pulse-circle ${city.pulseClass}`}
              />

              {/* Pin Core */}
              <circle
                cx={city.x}
                cy={city.y}
                r={city.isHq ? 4.8 : 3.8}
                className={`sl-pin-core ${city.isHq ? 'is-hq' : ''}`}
              />

              {/* City Label Text */}
              {city.labelAlign === 'left' && (
                <g transform={`translate(${city.x - 10}, ${city.y})`}>
                  <text
                    x="0"
                    y="-3"
                    textAnchor="end"
                    className={`sl-city-label ${city.isHq ? 'is-hq' : ''}`}
                  >
                    {city.name} {city.isHq ? '★' : ''}
                  </text>
                  <text
                    x="0"
                    y="7"
                    textAnchor="end"
                    className="sl-city-sublabel"
                  >
                    {city.tag}
                  </text>
                </g>
              )}

              {city.labelAlign === 'right' && (
                <g transform={`translate(${city.x + 10}, ${city.y})`}>
                  <text
                    x="0"
                    y="-3"
                    textAnchor="start"
                    className={`sl-city-label ${city.isHq ? 'is-hq' : ''}`}
                  >
                    {city.name}
                  </text>
                  <text
                    x="0"
                    y="7"
                    textAnchor="start"
                    className="sl-city-sublabel"
                  >
                    {city.tag}
                  </text>
                </g>
              )}

              {city.labelAlign === 'bottom' && (
                <g transform={`translate(${city.x}, ${city.y + 12})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    className={`sl-city-label ${city.isHq ? 'is-hq' : ''}`}
                  >
                    {city.name}
                  </text>
                  <text
                    x="0"
                    y="8"
                    textAnchor="middle"
                    className="sl-city-sublabel"
                  >
                    {city.tag}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
