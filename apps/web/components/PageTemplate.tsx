import React from "react";
import { motion } from "framer-motion";

interface PageTemplateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageTemplate({ children, title, description }: PageTemplateProps) {
  return (
    <motion.div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center pt-16 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {title && (
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4" id="page-title">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-base md:text-lg text-slate-300 mb-6 max-w-2xl text-center" id="page-description">
          {description}
        </p>
      )}
      <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8" id="page-content">
        {children}
      </div>
    </motion.div>
  );
}
