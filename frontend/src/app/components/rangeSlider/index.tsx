'use client';

import './index.css';

export default function RangeSlider({min, max, value, onChange}: {min: number, max: number, value: number, onChange: any}) {
    return (
        <div className="range-slider">
            <input type="range" min={min} max={max} value={value} className="slider" onChange={onChange} />
            <div className="slider-info">
                <p>${min}</p>
                <p>${max}</p>          
            </div>
        </div>
    )
}