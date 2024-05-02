'use client';

import './index.css';

export default function RangeSlider({min, max, change_indicator, value, onChange, onRelease}: {min: number, max: number, change_indicator: number, value: number, onChange: any, onRelease: any}) {
    return (
        <div className="range-slider">
            <input type="range" min={min} max={max} value={value} className="slider" onChange={onChange} onMouseUp={onRelease} onTouchEnd={onRelease}/>
            <div className="slider-info">
                <p>${change_indicator}</p>
                <p>${max}</p>          
            </div>
        </div>
    )
}