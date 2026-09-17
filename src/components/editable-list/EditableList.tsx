import React, { ReactNode, useCallback, useMemo, useState } from 'react';
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
import ActionTable, { Action, ActionTableProps } from '../action-table/ActionTable';
import useSettings from '../crud-mui-provider/hooks/useSettings';
import { DETAILPAGE_HOTKEYS_SCOPE } from '../detail-page/hooks/useDetailPageHotKeys';
import useDetailPageModal, {
  UseDetailPageModalReturn,
} from '../detail-page/hooks/useDetailPageModal';
import DetailPage from '../detail-page/pages/DetailPage';
import { NeedDataReason } from '../detail-page/pages/DetailPageContent';
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
  extends ActionCommandsProps<TModel> {
  editable?: boolean;
  onCancel?: () => void;
}

export interface EditableListProps<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> extends Omit<ActionTableProps<TArrayModel>, 'data' | 'onActionClick'> {
  /**,
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
   * Open detailPage in view mode as default or in which reason provided
   */
  enableRowClickToDetails?: boolean | NeedDataReason | ((model: TArrayModel) => boolean);
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
   * Show columns of create and delete-all commands
   */
  showCommands?: boolean;
  /**
   * DetailPage content
   */
  children?: ReactNode;
}

function EditableList<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
>({
  children,
  onCommands,
  onLayout,
  detailPageProps,
  detailType = 'drawer',
  disabled,
  enableDeleteAllButton,
  enableRowClickToDetails,
  headerProps,
  name,
  newItemTitle,
  onDelete,
  onSave,
  showCommands = true,
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
            return Promise.reject({ errors: messages.map((message) => ({ message })) });
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

  function actionClickHandler(action: Action, data?: TArrayModel) {
    switch (action) {
      case 'fetch':
        onOpen({ data });
        break;
      case 'copy':
        onOpen({ data, reason: 'copy' });
        break;
      case 'view':
        onOpen({ data, disabled: true });
        break;
      case 'delete': {
        const index = findIndex(data);
        remove(index);
        break;
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderTable = () => {
    return (
      <ActionTable<TArrayModel>
        showEmptyImage={false}
        onNewRow={() => onOpen()}
        newRowButtonText={newItemTitle}
        {...tableProps}
        rowIdField={UNIQUE_IDENTIFIER_FIELD_NAME as Path<TArrayModel>}
        data={fields as TArrayModel[]}
        enableSorting
        state={{
          sorting,
        }}
        onSortingChange={setSorting}
        getSortedRowModel={getSortedRowModel()}
        onRowClick={(_e, row) => {
          if (!enableRowClickToDetails || disabled) {
            return;
          }

          if (typeof enableRowClickToDetails === 'function') {
            const isEnabled = enableRowClickToDetails(row.original);
            if (!isEnabled) {
              return;
            }
          }

          const reason =
            typeof enableRowClickToDetails === 'string' ? enableRowClickToDetails : 'view';

          onOpen({
            data: row.original,
            reason,
            disabled: reason === 'view',
          });
        }}
        actionCommandsProps={{
          showView: !!disabledProp.disabled,
        }}
        onActionClick={actionClickHandler}
      />
    );
  };

  const renderDetailPage = () => {
    const props: DetailPageModalProps<TArrayModel> = {
      disabled,
      onDelete: deleteModel,
      enableCopy: tableProps?.actionCommandsProps?.showCopy,
      enableDelete: tableProps?.actionCommandsProps?.showDelete,
      onSave: saveModel,
      hotkeyScopes: `${name}-${DETAILPAGE_HOTKEYS_SCOPE}`,
      children,
      showSuccessMessages: false,
      header: disabled ? t('browse') : dpProps?.reason === 'fetch' ? t('edit') : t('newitem'),
      ...dpProps,
      ...detailPageProps,
      onClose() {
        onClose();
        detailPageProps?.onClose?.();
      },
    };

    return detailType === 'modal' ? (
      <DetailPage.Modal enableClose {...props} />
    ) : (
      <DetailPage.Drawer {...props} />
    );
  };

  const renderCommands = () => {
    if (!showCommands) {
      return null;
    }

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
