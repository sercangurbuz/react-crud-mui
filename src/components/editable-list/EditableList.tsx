import React, { PropsWithChildren, ReactNode, useCallback, useMemo, useState } from 'react';
import {
  FieldArray,
  FieldArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFieldArrayReturn,
} from 'react-hook-form';

import { getSortedRowModel, SortingState } from '@tanstack/react-table';

import ActionCommands, { ActionCommandsProps } from '../action-commands/ActionCommands';
import useSettings from '../crud-mui-provider/hooks/useSettings';
import { DETAILPAGE_HOTKEYS_SCOPE } from '../detail-page/hooks/useDetailPageHotKeys';
import useDetailPageModal, {
  UseDetailPageModalReturn,
} from '../detail-page/hooks/useDetailPageModal';
import DetailPage from '../detail-page/pages/DetailPage';
import { DataResult, DeletePayload, SavePayload } from '../detail-page/pages/DetailPageData';
import { DetailPageModalProps } from '../detail-page/pages/DetailPageModal';
import { useFormErrors } from '../form/hooks';
import useArrayFieldHelpers, {
  UNIQUE_IDENTIFIER_FIELD_NAME,
} from '../form/hooks/useArrayFieldHelpers';
import useRegisterField from '../form/hooks/useRegisterField';
import useUniqueFieldsInArray, { UniqueFields } from '../form/hooks/useUniqueFieldsInArray';
import useValidationOptionsContext from '../form/hooks/useValidationOptionsContext';
import { HeaderProps } from '../header/Header';
import useTranslation from '../i18n/hooks/useTranslation';
import usePage from '../page/hooks/usePage';
import Table, { TableColumn, TableProps } from '../table/Table';
import DefaultEditableListLayout, {
  DefaultEditableListControlLayoutProps,
} from './components/DefaultEditableListLayout';
import EditableListCommands, { EditableListCommandsProps } from './components/EditableListCommands';

export const ROW_STATE_FIELD = '__$row_state__';
export type RowStates = 'created' | 'modified' | 'pristine';

export type EditableListContextValue<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel>,
> = UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME> &
  Pick<UseDetailPageModalReturn<TArrayModel>, 'onOpen'>;

export const EditableListContext = React.createContext<EditableListContextValue<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> | null>(null);

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface EditingListCommandsProps<TModel extends FieldValues = FieldValues>
  extends ActionCommandsProps {
  editable?: boolean;
  onCancel?: () => void;
  model?: TModel;
}

export interface EditableListProps<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> extends Omit<TableProps<TArrayModel>, 'data'>,
    Pick<ActionCommandsProps, 'canCopy' | 'canDelete' | 'canEdit'>,
    PropsWithChildren {
  /**
   * Array model name of form
   */
  name: TFieldArrayName;
  /**
   * Disabled flag
   */
  disabled?: boolean;
  /**
   * Header props
   */
  headerProps?: HeaderProps;
  /**
   * Detail Page props
   */
  detailPageProps?: DetailPageModalProps<TArrayModel>;
  /**
   * New item command title
   */
  newItemTitle?: string;
  /**
   * Show delete all button
   */
  enableDeleteAllButton?: boolean;
  /**
   * Searching level of binded array model,default 1
   */
  searchLevel?: number;
  /**
   * DetailPage type one of Drawer or Modal
   */
  detailType?: 'modal' | 'drawer' | 'simple';
  /**
   * Custom layout
   */
  onLayout?: (props: DefaultEditableListControlLayoutProps<TModel, TFieldArrayName>) => ReactNode;
  /**
   * Custom save event which might include custom logic.It can retunr single or multi model
   * @param payload Form model
   * @returns New Model(s)
   */
  onSave?: (
    payload: SavePayload<TArrayModel>,
    api: UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>,
    handleSave: () => Promise<unknown> | undefined | void,
    checkUniqueFields: ReturnType<
      typeof useUniqueFieldsInArray<TModel, TArrayModel, TFieldArrayName>
    >,
  ) => DataResult<TArrayModel>;
  /**
   * Custom delete event.It can retunr single or multi index
   */
  onDelete?: (payload: DeletePayload<TArrayModel>, index: number) => number | number[];
  /**
   * Unique fields
   */
  uniqueFields?: UniqueFields<TModel, TArrayModel, TFieldArrayName>[];
  /**
   * Custom Commands on header
   */
  onCommands?: (props: EditableListCommandsProps<TModel, TFieldArrayName>) => React.ReactNode;
  /**
   * Custom commands when needed to override the default buttons
   */
  rowCommands?: (props: EditingListCommandsProps<TArrayModel>) => ReactNode;
  /**
   * Column props of commands
   */
  commandColProps?: TableColumn<TArrayModel>;
}

function EditableList<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
>({
  canCopy = true,
  canDelete = true,
  canEdit = true,
  children,
  columns,
  commandColProps,
  onCommands,
  onLayout,
  detailPageProps,
  detailType = 'drawer',
  disabled,
  enableDeleteAllButton,
  headerProps,
  name,
  newItemTitle,
  onDelete,
  onSave,
  rowCommands,
  uniqueFields,
  ...tableProps
}: EditableListProps<TModel, TArrayModel, TFieldArrayName>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const { keyFieldName } = useSettings();
  const [sorting, setSorting] = useState<SortingState>([]);

  /* ---------------------------------- Form ---------------------------------- */
  // register extra field data like group and label
  useRegisterField({ name });

  const arrayApi = useFieldArray<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>({
    name,
    keyName: UNIQUE_IDENTIFIER_FIELD_NAME,
  });

  const { fields, prepend, remove, update, replace } = arrayApi;

  const { findIndexByUID, findIndex } = useArrayFieldHelpers<TArrayModel>({
    models: fields as TArrayModel[],
  });

  /* ---------------------------- Is Form  Disabled --------------------------- */

  const { disabled: formDisable } = usePage();

  const disabledProp = useMemo(
    () => (formDisable === true ? { disabled: true } : { disabled }),
    [disabled, formDisable],
  );

  /* ---------------------------- Data unique check --------------------------- */

  const checkUniqueFields = useUniqueFieldsInArray<TModel, TArrayModel, TFieldArrayName>({
    api: arrayApi,
    uniqueFields,
  });

  /* ------------------------------- Validation ------------------------------- */

  const { fields: fieldList, callOutVisibility } = useValidationOptionsContext();

  const isEnabledFieldCallout =
    callOutVisibility === 'all' ||
    (callOutVisibility === 'selected-fields' && fieldList?.includes(name));

  const errors = useFormErrors({ name, disabled: !isEnabledFieldCallout });

  /* ------------------------------- DetailPage ------------------------------- */

  const [onOpen, { onClose, uid, ...dpProps }] = useDetailPageModal<TArrayModel>({
    models: fields as TArrayModel[],
  });

  /* --------------------------------- Columns -------------------------------- */

  // normalize columns adding action buttons
  const normalizedCols = useMemo<TableColumn<TArrayModel>[]>(() => {
    return [
      ...columns,
      {
        accessorKey: 'commands',
        align: 'center',
        header: () => null,
        enableSorting: false,
        cell(cell) {
          const data = cell.row.original;

          const props: EditingListCommandsProps<TArrayModel> = {
            onDelete: () => {
              // get current index by current uid
              const index = findIndex(data);
              remove(index);
            },
            onCopy: () => onOpen({ data, reason: 'copy' }),
            onView: () => onOpen({ data, disabled: true }),
            onEdit: () => onOpen({ data }),
            model: data,
            canCopy,
            canDelete,
            canEdit,
            ...disabledProp,
          };

          if (rowCommands) {
            return rowCommands(props);
          }

          return <ActionCommands {...props} />;
        },
        ...commandColProps,
      },
    ];
  }, [
    canCopy,
    canDelete,
    canEdit,
    columns,
    commandColProps,
    disabledProp,
    findIndex,
    onOpen,
    remove,
    rowCommands,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                                    Utils                                   */
  /* -------------------------------------------------------------------------- */

  const saveModel = useCallback(
    (payload: SavePayload<TArrayModel>) => {
      const { model, reason, data } = payload;

      /**
       *  Default save
       */
      const defaultSave = () => {
        /**
         * Unique fields check
         */
        if (uniqueFields?.length) {
          const messages = checkUniqueFields({ model, reason, uid });

          if (messages.length) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject({ messages });
          }
        }

        if (reason === 'fetch') {
          // get current index by current uid
          const index = findIndexByUID(uid!);
          const newModel = Object.assign({}, data, model, {
            [ROW_STATE_FIELD]: 'modified',
          });

          update(index!, newModel);
        } else {
          prepend(
            Object.assign({}, data, model, {
              [keyFieldName]: undefined,
              [ROW_STATE_FIELD]: 'created',
            }),
          );
        }
      };

      /**
       * Call custom or default one
       */

      return onSave ? onSave(payload, arrayApi, defaultSave, checkUniqueFields) : defaultSave();
    },
    [
      uniqueFields?.length,
      onSave,
      arrayApi,
      checkUniqueFields,
      uid,
      findIndexByUID,
      update,
      prepend,
      keyFieldName,
    ],
  );

  const deleteModel = useCallback(
    (payload: DeletePayload<TArrayModel>) => {
      // get current index by current uid
      const index = findIndexByUID(uid!);
      const inds = onDelete?.(payload, index!) ?? index;
      remove(inds);
      onClose();
    },
    [findIndexByUID, onClose, onDelete, remove, uid],
  );

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderTable = () => {
    return (
      <Table<TArrayModel>
        size="small"
        showEmptyImage={false}
        {...tableProps}
        rowIdField={UNIQUE_IDENTIFIER_FIELD_NAME as Path<TArrayModel>}
        data={fields as TArrayModel[]}
        enableSorting
        state={{
          sorting,
        }}
        onSortingChange={setSorting}
        getSortedRowModel={getSortedRowModel()}
        columns={normalizedCols}
        rowSx={{
          '.MuiTableCell-root': {
            borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          },
          '&:last-of-type': {
            '.MuiTableCell-root': {
              borderBottom: 'none',
            },
          },
        }}
        headerSx={{
          '.MuiTableCell-root': {
            backgroundColor: 'transparent',
            borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          },
        }}
      />
    );
  };

  const renderDetailPage = () => {
    const props: DetailPageModalProps<TArrayModel> = {
      onClose,
      disabled,
      onDelete: deleteModel,
      enableCopy: canCopy,
      onSave: saveModel,
      hotkeyScopes: `${name}-${DETAILPAGE_HOTKEYS_SCOPE}`,
      children,
      showSuccessMessages: false,
      title: disabled ? t('browse') : dpProps?.reason === 'fetch' ? t('edit') : t('newitem'),
      ...dpProps,
      ...detailPageProps,
    };

    return detailType === 'modal' ? (
      <DetailPage.Modal enableClose {...props} />
    ) : (
      <DetailPage.Drawer {...props} />
    );
  };

  const renderCommands = () => {
    const props: EditableListCommandsProps<TModel, TFieldArrayName> = {
      newItemTitle,
      onCreate: () => onOpen(),
      onDeleteAll: () => replace([]),
      enableDeleteAllButton,
      api: arrayApi,
      ...disabledProp,
    };

    if (onCommands) {
      return onCommands(props);
    }

    return <EditableListCommands {...props} />;
  };

  const renderLayout = () => {
    const tableContent = renderTable();
    const detailPageContent = renderDetailPage();
    const commandsContent = renderCommands();

    const props: DefaultEditableListControlLayoutProps<TModel, TFieldArrayName> = {
      tableContent,
      detailPageContent,
      commandsContent,
      errors,
      headerProps,
      rowCount: fields?.length,
      api: arrayApi,
    };

    if (onLayout) {
      return onLayout(props);
    }

    return <DefaultEditableListLayout {...props} />;
  };

  /* -------------------------------------------------------------------------- */
  /*                                Context value                               */
  /* -------------------------------------------------------------------------- */

  const editableListControlContextValue = useMemo<
    EditableListContextValue<TModel, TArrayModel, TFieldArrayName>
  >(
    () => ({
      ...arrayApi,
      onOpen,
    }),
    [arrayApi, onOpen],
  );

  return (
    <EditableListContext.Provider value={editableListControlContextValue}>
      {renderLayout()}
    </EditableListContext.Provider>
  );
}

EditableList.Commands = EditableListCommands;
EditableList.RowCommands = ActionCommands;
EditableList.DefaultLayout = DefaultEditableListLayout;

export default EditableList;
