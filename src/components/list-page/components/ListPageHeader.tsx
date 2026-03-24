import { FlexBox } from '../../flexbox';
import Header, { HeaderProps } from '../../header/Header';

export interface ListPageHeaderProps extends HeaderProps {
  showDataCount?: boolean;
  dataCount?: number;
}

function ListPageHeader({ showDataCount, dataCount, ...props }: ListPageHeaderProps) {
  return (
    <Header
      {...props}
      header={
        showDataCount && dataCount ? (
          <FlexBox alignItems="center" gap={0.5}>
            <span>{props.header}</span>
            {`(${dataCount})`}
          </FlexBox>
        ) : (
          props.header
        )
      }
    />
  );
}

export default ListPageHeader;
