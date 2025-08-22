"use client";

import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github size={18} />, href: "https://github.com/karanagg166/Wallet-Track", label: "GitHub" },
    { icon: <Twitter size={18} />, href: "https://x.com/Karanaggrawal1", label: "Twitter" },
    { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/karan-aggarwal-a13427276/", label: "LinkedIn" },
    { icon: <Mail size={18} />, href: "aggarwalkaran241@gmail.com", label: "Email" },
  ];

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mt-auto"
    >
      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-blue-500 opacity-40" />

      {/* Main footer content */}
      <div 
        className="relative"
        style={{
          background: "rgba(20, 28, 48, 0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Brand and social links */}
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-white">WalletTrack</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 
                             border border-gray-600/30 text-gray-300 hover:text-cyan-400 transition-all duration-300
                             hover:border-cyan-400/50"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
             Copyright © {currentYear} KA. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent opacity-40" />
    </motion.footer>
  );
};

export default Footer;
