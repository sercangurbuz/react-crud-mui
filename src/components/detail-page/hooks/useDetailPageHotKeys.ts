import { HotkeyCallback, Options, useHotkeys } from 'react-hotkeys-hook';

import useTranslation from '../../i18n/hooks/useTranslation';
import useSettings from '../../settings-provider/hooks/useSettings';
import useDetailPageCommandStates from './useDetailPageCommandStates';

export interface UseDetailPageHotKeysProps extends Partial<Options> {
  onSave: HotkeyCallback;
  onNewItem?: HotkeyCallback;
  onDelete: HotkeyCallback;
  onSaveClose: HotkeyCallback;
  onSaveCreate: HotkeyCallback;
}

// Hotkey scope name for preventing conflict
export const DETAILPAGE_HOTKEYS_SCOPE = 'detailpage-scope';

const HOTKEYS_COMMON_PROPS: Partial<Options> = {
  preventDefault: true,
  enableOnFormTags: ['input', 'select', 'textarea'],
};
/**
 * Hotkeys for ListPage component
 */
function useDetailPageHotKeys({
  onSave,
  onDelete,
  onSaveCreate,
  onSaveClose,
  onNewItem,
  scopes = DETAILPAGE_HOTKEYS_SCOPE,
  ...hotKeyOptions
}: UseDetailPageHotKeysProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { disabled, loading, visible } = useDetailPageCommandStates();
  const { t } = useTranslation();

  const {
    hotkeys: {
      save: SHORTCUT_SAVE,
      saveAndNewItem: SHORTCUT_SAVECREATE,
      saveClose: SHORTCUT_SAVECLOSE,
      delete: SHORTCUT_DELETE,
      newItem: SHORTCUT_NEWITEM,
    },
  } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                                   Hotkeys                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Search
   */
  useHotkeys(SHORTCUT_SAVE, onSave, {
    enabled: !disabled.save && visible.save && !loading,
    description: t('savetitle'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * New Item
   */
  useHotkeys(SHORTCUT_NEWITEM, (ke, he) => onNewItem?.(ke, he), {
    enabled: !disabled.create && visible.create && !loading,
    description: t('newitemtitle'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * Save and create new item
   */
  useHotkeys(SHORTCUT_SAVECREATE, onSaveCreate, {
    enabled: !disabled.save && visible.savecreate && !loading,
    description: t('savecreate'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * Save and create new item
   */
  useHotkeys(SHORTCUT_SAVECLOSE, onSaveClose, {
    enabled: !disabled.save && visible.savecreate && !loading,
    description: t('saveclosetitle'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });

  /**
   * Show stored filter panel
   */
  useHotkeys(SHORTCUT_DELETE, onDelete, {
    enabled: !disabled.delete && visible.delete && !loading,
    description: t('deletetitle'),
    scopes,
    ...HOTKEYS_COMMON_PROPS,
    ...hotKeyOptions,
  });
}

export default useDetailPageHotKeys;
