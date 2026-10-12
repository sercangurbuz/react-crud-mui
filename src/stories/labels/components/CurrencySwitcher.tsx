import useSettings from '../../../components/crud-mui-provider/hooks/useSettings';
import { Currency } from '../../../components/misc/getCurrencySymbolProps';
import Select from '../../../components/select/Select';

function CurrencySwitcher() {
  const { defaultCurrency, setSettings } = useSettings();
  return (
    <Select
      value={defaultCurrency}
      sx={{ width: 120 }}
      allowClear={false}
      onChange={(e) => setSettings({ defaultCurrency: e.target.value as Currency })}
      data={[
        { id: 'TL', name: 'TL' },
        { id: 'USD', name: 'USD' },
        { id: 'EUR', name: 'EUR' },
      ]}
    />
  );
}

export default CurrencySwitcher;
