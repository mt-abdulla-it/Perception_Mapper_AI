import React from 'react';
import TeamForm from '../components/admin/team/TeamForm';

export default {
  title: 'Admin/TeamForm',
  component: TeamForm,
  decorators: [
    (Story: any) => {
      // Mock window.fetch for user list and form submit
      window.fetch = (url: any, options: any) => {
        if (options && options.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          } as Response);
        }
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: 'u1', email: 'user1@company.com' },
              { id: 'u2', email: 'user2@company.com' },
              { id: 'u3', email: 'user3@company.com' },
            ]),
        } as Response);
      };
      return (
        <div className="p-6 bg-slate-950 min-h-screen text-white max-w-md mx-auto">
          <Story />
        </div>
      );
    },
  ],
};

export const Default = () => <TeamForm />;
