import { forwardRef, useState } from 'react';

import { InputBaseProps } from '@mui/material/InputBase';

import { useDebounce, useUpdateEffect } from '../hooks';
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
  ({ onSearch, defaultValue = '', bordered = true, ...props }, ref) => {
    const [keyword, setKeyword] = useState<string>(defaultValue as string);
    const ADORNMENT = <SearchIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />;
    const { t } = useTranslation();

    const debouncedKeyword = useDebounce(keyword, 400);

    useUpdateEffect(() => {
      onSearch(debouncedKeyword);
    }, [debouncedKeyword, onSearch]);

    return (
      <StyledInputBase
        ref={ref}
        border={bordered ? 1 : 0}
        startAdornment={ADORNMENT}
        placeholder={t('search')}
        onChange={(e) => setKeyword(e.target.value)}
        {...props}
      />
    );
  },
);
