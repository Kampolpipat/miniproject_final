import React from 'react'
import Logo from '../../img/D.DasLogo.png'
import { UilSearch } from '@iconscout/react-unicons'
import './LogoSearch.css'

const LogoSearch = () => {
  return (
    <div>
      <div className="LogoSearch">
        <img src={Logo} alt="Logo" />
        <div className="Search">
          <input type="text" placeholder='Explore...' />
          <div className="s-icon">
            <UilSearch />
          </div>
        </div>     
      </div>
    </div>
  )
}

export default LogoSearch
