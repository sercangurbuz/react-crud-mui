import { forwardRef, useEffect, useState } from 'react';

import { InputBaseProps } from '@mui/material/InputBase';

import { useDebounce } from '../hooks';
import SearchIcon from '../icons/SearchIcon';
import { StyledInputBase } from './styles';

// ========================================================================
interface SearchInputProps extends InputBaseProps {
  bordered?: boolean;
  onSearch: (keyword: string) => void;
}
// ========================================================================

export default forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, defaultValue = '', bordered = true, ...props }, ref) => {
    // SEARCH ICON
    const [keyword, setKeyword] = useState<string>(defaultValue as string);
    const ADORNMENT = <SearchIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />;

    const debouncedKeyword = useDebounce(keyword, 400);

    useEffect(() => {
      onSearch(debouncedKeyword);
    }, [debouncedKeyword]);

    return (
      <StyledInputBase
        ref={ref}
        border={bordered ? 1 : 0}
        startAdornment={ADORNMENT}
        onChange={(e) => setKeyword(e.target.value)}
        {...props}
      />
    );
  },
);
