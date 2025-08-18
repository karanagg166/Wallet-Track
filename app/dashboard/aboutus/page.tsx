// About Us Page - Enhanced UI
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaGithub, FaGlobe } from 'react-icons/fa';
import { SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks } from 'react-icons/si';
import Link from 'next/link';

const contributors = [
  {
    name: 'Karan Aggarwal',
    location: 'Faridabad, Haryana',
    university: 'PDPM IIITDMJ, Jabalpur',
    description: `I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️\n\nI am fluent in classics like C++, Javascript and React.\n\nMy field of Interest's are building new Web Technologies and Products and also in areas related to Data Structures and Algorithms, Competitive programming.\n\nWhenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js and Next.js.`,
    hobbies: ['Playing chess and badminton', 'Watching movies and series', 'Traveling and exploring'],
    quote: 'Strive to build things that make a difference!',
    image: '/images/karan.jpeg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/karan-aggarwal-a13427276/',
      instagram: 'https://www.instagram.com/karanagg_166/',
      leetcode: 'https://leetcode.com/u/aggarwalkaran241/',
      codeforces: 'https://codeforces.com/profile/KaranCipherKnight',
      codechef: 'https://www.codechef.com/users/code_rush03',
      geeksforgeeks: 'https://www.geeksforgeeks.org/user/aggarwalkaran241/',
      github: 'https://github.com/karanagg166',
      portfolio: 'https://portfolio-kappa-bay-76.vercel.app/',
    },
  },
  {
    name: 'Harsh Mishra',
    location: 'Indore, Madhya Pradesh',
    university: 'PDPM IIITDMJ, Jabalpur',
    description: `A curious mind with a love for clean code and smart solutions.\n\nI specialize in full-stack development, with a focus on performance and user experience.\n\nCurrently diving deeper into system design and exploring DevOps tools to build robust and scalable applications.\n\nAlways up for a challenge and excited by innovation.`,
    hobbies: ['Sketching and digital art', 'Cycling long distances', 'Tinkering with hardware and IoT'],
    quote: 'Code with purpose, design with passion.',
    image: '/images/harsh.jpeg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/harsh-mishra-636311248/',
      instagram: 'https://www.instagram.com/itsharshmishra/',
      leetcode: 'https://leetcode.com/u/hmishra1729/',
      codeforces: 'https://codeforces.com/profile/itsharshmishra',
      codechef: '#',
      geeksforgeeks: '#',
      github: 'https://github.com/itsharshmishra',
      portfolio: 'https://harshmishra.dev',
    },
  },
];

const iconMap = {
  linkedin: <FaLinkedin className="hover:text-[#0077b5] transition-all duration-300" />,
  instagram: <FaInstagram className="hover:text-[#e1306c] transition-all duration-300" />,
  leetcode: <SiLeetcode className="hover:text-yellow-400 transition-all duration-300" />,
  codeforces: <SiCodeforces className="hover:text-[#1f8acb] transition-all duration-300" />,
  codechef: <SiCodechef className="hover:text-[#5b4638] transition-all duration-300" />,
  geeksforgeeks: <SiGeeksforgeeks className="hover:text-green-500 transition-all duration-300" />,
  github: <FaGithub className="hover:text-gray-300 transition-all duration-300" />,
  portfolio: <FaGlobe className="hover:text-teal-300 transition-all duration-300" />,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text animate-pulse">
        Meet the Contributors
      </h1>
      <div className="grid md:grid-cols-2 gap-10">
        {contributors.map((contributor, idx) => (
          <motion.div
            key={idx}
            whileHover={{ rotateY: 5, rotateX: 5, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-[#1e293b]/90 rounded-3xl p-6 shadow-xl backdrop-blur-md border border-blue-400/20 relative overflow-hidden"
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-4 shadow-lg border-4 border-blue-400/40 rounded-full overflow-hidden transition-transform duration-500 hover:rotate-[8deg] hover:scale-110"
              whileHover={{ rotateY: 5, rotateX: 5, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <img
                src={contributor.image}
                alt={contributor.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-300 to-cyan-400 text-transparent bg-clip-text">
              {contributor.name}
            </h2>
            <p className="text-center text-sm text-[#94a3b8] italic mb-2">{contributor.location} — {contributor.university}</p>
            <p className="text-[#e2e8f0] mb-4 whitespace-pre-line text-sm">{contributor.description}</p>
            <ul className="mb-4 text-sm list-disc list-inside text-[#7dd3fc]">
              {contributor.hobbies.map((hobby, i) => (
                <li key={i}>{hobby}</li>
              ))}
            </ul>
            <blockquote className="text-center italic text-[#38bdf8] border-l-4 border-blue-400 pl-4">"{contributor.quote}"</blockquote>

            <div className="flex justify-center mt-6 gap-4 text-xl">
              {Object.entries(contributor.socials).map(([platform, link], i) => (
                <Link key={i} href={link} target="_blank" className="transition-transform hover:scale-125">
                  {iconMap[platform]}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
