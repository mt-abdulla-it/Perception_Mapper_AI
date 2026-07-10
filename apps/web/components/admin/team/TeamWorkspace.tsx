"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import TeamStats from './TeamStats';
import TeamTable from './TeamTable';
import TeamForm from './TeamForm';
import TeamActivityFeed from './TeamActivityFeed';

export default function TeamWorkspace() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <motion.section
      className="grid lg:grid-cols-3 gap-6 p-4 glassmorphism"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lg:col-span-2 space-y-6">
        <TeamStats refreshKey={refreshKey} />
        <TeamTable refreshKey={refreshKey} onTeamDeleted={triggerRefresh} />
        <TeamForm onTeamCreated={triggerRefresh} />
      </div>
      <TeamActivityFeed />
    </motion.section>
  );
}
