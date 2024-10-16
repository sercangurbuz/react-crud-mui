import useHotKeysSingleScope from '../../hooks/useHotKeysSingleScope';
import useListPageHotKeys, { UseListPageHotKeysProps } from '../hooks/useListPageHotKeys';

interface ListPageShortCutsProps extends UseListPageHotKeysProps {}

/**
 * Dummy wrapper component for shortcut hook
 */
function ListPageShortCuts(props: ListPageShortCutsProps) {
  useListPageHotKeys({
    ...props,
  });
  useHotKeysSingleScope({ targetScope: props.scopes as string });
  return null;
}

export default ListPageShortCuts;
