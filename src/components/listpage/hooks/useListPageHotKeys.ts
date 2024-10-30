import { Options, useHotkeys } from 'react-hotkeys-hook';

import useTranslation from '../../i18n/hooks/useTranslation';
import useSettings from '../../settings-provider/hooks/useSettings';
import useListPageCommandStates from './useListPageCommandStates';

export interface UseListPageHotKeysProps extends Partial<Options> {
  onSearch: () => void;
  onCreateItem?: () => void;
  onClear: () => void;
  onExport: () => void;
}

// Hotkey scope name for preventing conflict
export const LISTPAGE_HOTKEYS_SCOPE = 'listpage-scope';
const HOTKEYS_COMMON_PROPS: Partial<Options> = {
  preventDefault: true,
  enableOnFormTags: ['input', 'select', 'textarea'],
};
/**
 * Hotkeys for ListPage component
 */
function useListPageHotKeys({
  onSearch,
  onCreateItem,
  onClear,
  onExport,
  scopes = LISTPAGE_HOTKEYS_SCOPE,
  ...hotKeyOptions
}: UseListPageHotKeysProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { disabled, loading, visible } = useListPageCommandStates();
  const { t } = useTranslation();

  const {
    hotkeys: {
      search: SHORTCUT_SEARCH,
      newItem: SHORTCUT_NEWITEM,
      clear: SHORTCUT_CLEAR,
      export: SHORTCUT_EXPORT,
    },
  } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                                   Hotkeys                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Search
   */
  useHotkeys(SHORTCUT_SEARCH, onSearch, {
    enabled: !disabled.search && !!visible.search && !loading,
    description: t('listpage.listbuttons.searchtitle'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * Export
   */
  useHotkeys(SHORTCUT_EXPORT, onExport, {
    enabled: !disabled.search && !!visible.export && !loading,
    description: t('listpage.settings.exportExcel'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * New Item
   */
  useHotkeys(
    SHORTCUT_NEWITEM,
    () => {
      onCreateItem?.();
    },
    {
      enabled: !!onCreateItem && !disabled.create && !!visible.create && !loading,
      description: t('newitemtitle'),
      scopes,
      ...HOTKEYS_COMMON_PROPS,
      ...hotKeyOptions,
    },
  );

  /**
   * Clear  filter form values
   */
  useHotkeys(
    SHORTCUT_CLEAR,
    () => {
      onClear?.();
    },
    {
      description: t('listpage.listbuttons.cleartitle'),
      scopes,
      ...HOTKEYS_COMMON_PROPS,
      ...hotKeyOptions,
    },
  );
}

export default useListPageHotKeys;
