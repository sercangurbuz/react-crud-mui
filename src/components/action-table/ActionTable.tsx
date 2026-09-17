import { ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { Draft, produce } from 'immer';

import { ActionCommands, ActionCommandsProps, Table, TableColumn, TableProps } from '../..';
import { NeedDataReason } from '../detail-page/pages/DetailPageContent';

export type Action = NeedDataReason | 'delete';
export const ACTION_COMMANDS_COLUMN_ID: string = '__$commands__';

/**
 * Props for the ActionTable component, which extends the TableProps and includes additional properties for handling action commands.
 */
export interface ActionProps<TModel extends FieldValues = FieldValues> {
  /**
   * Render action commands used with detailPage on every row
   */
  enableActionCommands?: boolean;
  /**
   * Column props of commands
   */
  actionColumnProps?: Partial<TableColumn<TModel>>;
  /**
   * Custom render function for action commands
   */
  onActionCommands?: (props: ActionCommandsProps<TModel>) => ReactNode;
  /**
   * Action commands extra props
   */
  actionCommandsProps?: Partial<ActionCommandsProps<TModel>>;
  /**
   * Action click event. It's not fired in case OnDetailPage is provided for create, edit, copy reasons
   */
  onActionClick: (
    action: Action,
    model?: TModel,
    args?: unknown,
    props?: ActionCommandsProps<TModel>,
  ) => void;
}

export type ActionTableProps<TModel extends FieldValues = FieldValues> = TableProps<TModel> &
  ActionProps<TModel> & { disabled?: boolean };

function ActionTable<TModel extends FieldValues = FieldValues>({
  onActionClick,
  disabled,
  actionCommandsProps,
  onActionCommands,
  actionColumnProps,
  enableActionCommands = true,
  ...tableProps
}: ActionTableProps<TModel>) {
  const actionTableProps = useMemo(() => {
    const p = produce<TableProps<TModel>>(tableProps, (draft) => {
      draft.columns?.push({
        id: ACTION_COMMANDS_COLUMN_ID,
        align: 'center',
        header: () => null,
        size: 70,
        ...actionColumnProps,
        enableSorting: false,
        cell(cell) {
          const data = cell.row.original;

          const props: ActionCommandsProps<TModel> = {
            onDelete: () => onActionClick('delete', data),
            onView: () => onActionClick('view', data),
            onEdit: () => onActionClick('fetch', data),
            onCopy: () => onActionClick('copy', data),
            model: data,
            index: cell.row.index,
            disabled,
            ...actionCommandsProps,
          };

          if (onActionCommands) {
            return onActionCommands(props);
          }

          return <ActionCommands {...props} />;
        },
      } as Draft<TableColumn<TModel>>);
    });

    return p;
  }, [
    tableProps,
    actionColumnProps,
    actionCommandsProps,
    onActionClick,
    onActionCommands,
    disabled,
  ]);

  return <Table {...(enableActionCommands ? actionTableProps : tableProps)} />;
}

export default ActionTable;
