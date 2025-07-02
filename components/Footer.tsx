'use client'; // ✅ If you’re using app directory and this is a client component

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MyApp</div>
      <ul style={styles.navItems}>
        <li><Link href="/" style={styles.link}>Home</Link></li>
        <li><Link href="/about" style={styles.link}>About</Link></li>
        <li><Link href="/contact" style={styles.link}>Contact</Link></li>
      </ul>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '10px 20px',
    color: 'white',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navItems: {
    listStyleType: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default Footer;
