import { FlexBox } from '../../flexbox';
import Header, { HeaderProps } from '../../header/Header';

export interface ListPageHeaderProps extends HeaderProps {
  showDataCount?: boolean;
  dataCount?: number;
}

function ListPageHeader(props: ListPageHeaderProps) {
  return (
    <Header
      {...props}
      header={
        props.showDataCount && props.dataCount ? (
          <FlexBox alignItems="center" gap={0.5}>
            <span>{props.header}</span>
            {`(${props.dataCount})`}
          </FlexBox>
        ) : (
          props.header
        )
      }
    />
  );
}

export default ListPageHeader;
