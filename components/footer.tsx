import React from 'react';
import tmdb from '../images/tmdb.svg'
import footerStyle from '../styles/App.module.css'
import Image from 'next/image'


const Footer = () =>{
  return(
    <div className = {footerStyle.footer}>
      <div>Movie images and info powered by:</div>
      <a href = 'https://www.themoviedb.org/'>
      <Image src = {tmdb} alt = "The Movie Database"/>
      </a>
    </div>
  )
}



export default Footer;