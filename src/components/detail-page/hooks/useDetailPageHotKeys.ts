import { HotkeyCallback, Options, useHotkeys } from 'react-hotkeys-hook';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useTranslation from '../../i18n/hooks/useTranslation';
import { SaveMode } from '../pages/DetailPageData';
import useDetailPageCommandStates from './useDetailPageStates';

export interface UseDetailPageHotKeysProps extends Partial<Options> {
  onSave: HotkeyCallback;
  onNewItem?: HotkeyCallback;
  onDelete: HotkeyCallback;
  onSaveClose: HotkeyCallback;
  onSaveCreate: HotkeyCallback;
  defaultSaveMode?: SaveMode;
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
  defaultSaveMode,
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

  const onDefaultSaveEvent =
    defaultSaveMode === 'save-close'
      ? onSaveClose
      : defaultSaveMode === 'save-create'
        ? onSaveCreate
        : onSave;

  /**
   * Search
   */
  useHotkeys(SHORTCUT_SAVE, onDefaultSaveEvent, {
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
