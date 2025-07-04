import { forwardRef, useMemo, useState } from 'react';

import { InputBaseProps } from '@mui/material/InputBase';
import debounce from 'lodash.debounce';

import useTranslation from '../i18n/hooks/useTranslation';
import SearchIcon from '../icons/SearchIcon';
import { StyledInputBase } from './styles';

// ========================================================================
export interface SearchInputProps extends InputBaseProps {
  bordered?: boolean;
  onSearch: (keyword: string) => void;
}
// ========================================================================

export default forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onChange, defaultValue = '', bordered = true, ...props }, ref) => {
    const [keyword, setKeyword] = useState<string>(defaultValue as string);
    const ADORNMENT = <SearchIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />;
    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const lazyOnChange = useMemo(() => debounce(onSearch, 400), []);

    return (
      <StyledInputBase
        ref={ref}
        border={bordered ? 1 : 0}
        startAdornment={ADORNMENT}
        placeholder={t('search')}
        {...props}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          onChange?.(e);
          lazyOnChange(e.target.value);
        }}
      />
    );
  },
);
