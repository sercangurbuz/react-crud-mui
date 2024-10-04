import { FlexBox } from '../../flexbox';
import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import Delete from '../../icons/Delete';
import { MoreButtonItem } from '../../more-button/MoreButton';
import { DetailPageCommmandsSettings } from './DetailPageCommands';

function DetailPageDrawerCommands({ layout, props }: DetailPageCommmandsSettings) {
  const { t } = useTranslation();
  const { save, renderMoreCommand } = layout;
  const { disabled, onCreate, onDelete, visible, commandsPosition } = props;

  const items: (MoreButtonItem | null)[] = [
    visible.create
      ? {
          key: 'create',
          icon: <Add />,
          disabled: disabled.create,
          onClick: onCreate,
          children: t('newitem'),
        }
      : null,
    visible.delete
      ? {
          key: 'delete',
          icon: <Delete />,
          disabled: disabled.delete,
          onClick: onDelete,
          danger: true,
          children: t('delete'),
        }
      : null,
  ].filter(Boolean);

  const moreContent = renderMoreCommand(items as MoreButtonItem[]);

  return (
    <>
      {save}
      {moreContent}
    </>
  );
}

export default DetailPageDrawerCommands;
