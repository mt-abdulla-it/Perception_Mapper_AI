import React from 'react';
import TeamStats from '../components/admin/team/TeamStats';

export default {
  title: 'Admin/TeamStats',
  component: TeamStats,
  decorators: [
    (Story: any) => {
      // Mock window.fetch for teams list
      window.fetch = () =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: '1', name: 'Designers', members: [{}, {}, {}], tier: 'TEAM', status: 'Active', createdAt: new Date().toISOString() },
              { id: '2', name: 'Developers', members: [{}, {}, {}, {}, {}], tier: 'TEAM', status: 'Active', createdAt: new Date().toISOString() },
              { id: '3', name: 'Marketing', members: [{}, {}], tier: 'PRO', status: 'Active', createdAt: new Date().toISOString() },
            ]),
        } as Response);
      return (
        <div className="p-6 bg-slate-950 min-h-screen text-white">
          <Story />
        </div>
      );
    },
  ],
};

export const Default = () => <TeamStats />;
