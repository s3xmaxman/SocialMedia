import React from 'react'
import './TrendCard.css'
import {TrendData} from '../../Data/TrendData'
const TrendCard = () => {
  return (
    <div className="TrendCard">
        <h3>Trends for you</h3>
        {TrendData.map((trend, id)=>{ 
            return (
            <div key={id} className="trend">
                <span>#{trend.name}</span>
                <span>{trend.shares}K shares</span>
            </div>
            )
        })}
    </div>
  )
}

export default TrendCard