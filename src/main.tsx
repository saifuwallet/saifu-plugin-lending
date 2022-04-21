import { Plugin, PluginSettings, Setting } from 'saifu';

import SolendIcon from '@/components/SolendIcon';

import DepositList from './components/DepositList';
import SummaryCard from './components/SummaryCard';
import useSummary from './hooks/useSummary';

const Solend = () => {
  return (
    <div className="space-y-4">
      <SummaryCard />
      <DepositList />
    </div>
  );
};

interface SolendPluginSettings {
  color: string;
}

const DEFAULT_SETTINGS: SolendPluginSettings = {
  color: 'red',
};

class Settings extends PluginSettings {
  plugin: LendingPlugin;

  constructor(plugin: LendingPlugin) {
    super(plugin);
    this.plugin = plugin;
  }

  display() {
    const setting = new Setting()
      .setName('Main Settings')
      .setDesc('Please enter your favorite color')

      // add a textbox
      .addText((text) => {
        return text
          .setPlaceholder('placeholder')
          .setValue(this.plugin.settings.color)
          .onChange(async (val) => {
            this.plugin.settings.color = val;
            await this.plugin.saveSettings();
          });
      });

    return [setting];
  }
}

class LendingPlugin extends Plugin {
  id = 'lending';
  settings: SolendPluginSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    this.addView({
      id: 'overview',
      title: 'Lending',
      component: Solend,
      icon: <SolendIcon className="h-5 w-5" />,
    });

    this.setSummaryHook(useSummary);

    this.setSettings(new Settings(this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

export default LendingPlugin;
