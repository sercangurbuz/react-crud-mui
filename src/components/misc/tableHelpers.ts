import { ColumnTitle } from 'antd/es/table/interface';

import { TableColumn } from '../table/Table';

/**
 * Convert DataIndex values to string
 */
function getColId<TModel>({ id, dataIndex }: TableColumn<TModel>) {
  if (!id && !dataIndex) {
    return '';
  }
  return id ?? ((Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex) as string);
}

/**
 * Get id as dataIndex type
 */
function getDataIndex(id: string) {
  if (!id) {
    return null;
  }
  return id.includes('.') ? id.split('.') : id;
}

function getColTitle<T>(title: ColumnTitle<T>) {
  return typeof title === 'function' ? title({}) : title;
}

export { getColId, getColTitle, getDataIndex };
