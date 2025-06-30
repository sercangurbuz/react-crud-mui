import DetailPageCommands, { DetailPageCommandsProps } from './DetailPageCommands';

function DetailPageDrawerCommands(props: DetailPageCommandsProps) {
  return <DetailPageCommands {...props} moreCommands={{ create: true, delete: true }} />;
}

export default DetailPageDrawerCommands;
