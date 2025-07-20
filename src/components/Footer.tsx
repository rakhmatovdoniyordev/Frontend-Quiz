import React from "react";
import {  FaCode, FaGithub, FaLinkedin, FaTelegram, FaInstagram } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="flex justify-between gap-8 mb-8 max-[600px]:flex-wrap">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                <FaCode className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Bilim Testi
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed max-w-[500px]">
              React va Vue.js bo'yicha bilimingizni sinab ko'ring. Professional dasturchilar uchun mo'ljallangan
              interaktiv test platformasi.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Ishlab chiqildi</span>
              <a href="https://react-ts-portfolio-tau.vercel.app/" target="_blank" className="font-bold text-blue-500 animate-bounce">@rakhmatov_doniyor</a>
              <span>tomonidan O'zbekistonda</span>
            </div>
          </div>


          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Bog'lanish</h4>
            <div className="space-y-3">
              {/* Social Links */}
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://github.com/rakhmatovdoniyordev"
                  className="w-10 h-10 bg-gray-700 hover:bg-violet-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  target="_blank"
                  title="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/doniyor-rakhmatov-4212b2349/"
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="LinkedIn"
                  target="_blank"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://t.me/rakhmatov_doniyor"
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="Telegram"
                  target="_blank"
                >
                  <FaTelegram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/rakhmatov_doniyor/"
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="Instagram"
                  target="_blank"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© {currentYear} Bilim Testi. Barcha huquqlar himoyalangan.</div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                Foydalanish shartlari
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                Yordam
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"></div>
    </footer>
  )
}


export default React.memo(Footer);