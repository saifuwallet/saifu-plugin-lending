import { Plugin } from 'saifu';

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
      icon: (
        <img
          src="https://solend.fi/assets/tokens/slnd.png"
          alt="solend"
          className="h-5 w-5 m-auto"
        />
      ),
    });
  }
}

export default LendingPlugin;
