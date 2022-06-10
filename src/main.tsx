import { Plugin } from 'saifu';

import SolendIcon from '@/components/SolendIcon';

import DepositList from './components/DepositList';
import SummaryCard from './components/SummaryCard';

const Solend = () => {
  return (
    <div className="space-y-4">
      <SummaryCard />
      <DepositList />
    </div>
  );
};

class LendingPlugin extends Plugin {
  id = 'lending';

  async onload(): Promise<void> {
    this.addView({
      id: 'overview',
      title: 'Lending',
      component: Solend,
      icon: <SolendIcon className="h-5 w-5" />,
    });
  }
}

export default LendingPlugin;
