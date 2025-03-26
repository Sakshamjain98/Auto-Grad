import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Assignment Management System</h2>
            <p className="text-gray-400 mt-1">Empowering teachers and students</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="/about" className="hover:text-blue-300">About</a>
            <a href="/contact" className="hover:text-blue-300">Contact</a>
            <a href="/privacy" className="hover:text-blue-300">Privacy Policy</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Assignment Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
