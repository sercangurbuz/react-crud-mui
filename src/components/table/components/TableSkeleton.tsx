import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableProps,
  TableRow,
} from '@mui/material';

export interface TableSkeletonProps extends TableProps {
  column?: number;
  row?: number;
  sizes: (number | string)[];
  showHeader?: boolean;
  showBody?: boolean;
  showTable?: boolean;
}

function TableSkeleton({
  showHeader = true,
  showTable = true,
  showBody = true,
  sizes,
  column = 3,
  row = 2,
  ...rest
}: TableSkeletonProps) {
  const renderBody = () => {
    return (
      <TableBody>
        {Array(row)
          .fill('')
          .map((_item, ind) => (
            <TableRow key={ind}>
              {Array(column)
                .fill('')
                .map((_item, indx) => (
                  <TableCell key={indx} width={sizes[indx]} sx={{ py: 1 }}>
                    <Skeleton variant="rectangular" width="100%" height={30} />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    );
  };

  const renderHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {Array(column)
            .fill('')
            .map((_item, ind) => (
              <TableCell key={ind}>
                <Skeleton variant="text" width={sizes[ind]} height={20} />
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
  };

  if (showTable) {
    return (
      <Table width="100%" {...rest}>
        {showHeader && renderHeader()}
        {showBody && renderBody()}
      </Table>
    );
  }

  return (
    <>
      {showHeader && renderHeader()}
      {showBody && renderBody()}
    </>
  );
}

export default TableSkeleton;
