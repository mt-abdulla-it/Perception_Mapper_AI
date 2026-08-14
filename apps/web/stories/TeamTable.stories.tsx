import React from 'react';
import TeamTable from '../components/admin/team/TeamTable';

export default {
  title: 'Admin/TeamTable',
  component: TeamTable,
  decorators: [
    (Story: any) => {
      // Mock window.fetch for teams list
      window.fetch = (url: any, options: any) => {
        if (options && options.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          } as Response);
        }
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: '1', name: 'Alpha Core', leadEmail: 'alpha-lead@company.com', members: [{}, {}, {}], tier: 'TEAM', status: 'Active', createdAt: '2026-01-15T08:00:00.000Z' },
              { id: '2', name: 'Beta Labs', leadEmail: 'beta-dev@company.com', members: [{}, {}, {}, {}], tier: 'TEAM', status: 'Active', createdAt: '2026-02-10T12:00:00.000Z' },
              { id: '3', name: 'Gamma Growth', leadEmail: 'gamma-mkt@company.com', members: [{}], tier: 'PRO', status: 'Suspended', createdAt: '2026-03-01T09:30:00.000Z' },
            ]),
        } as Response);
      };
      return (
        <div className="p-6 bg-slate-950 min-h-screen text-white">
          <Story />
        </div>
      );
    },
  ],
};

export const Default = () => <TeamTable />;
