import { SaveAltOutlined } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

import ActionCommands, {
  ActionCommandsProps,
} from '../../../components/action-commands/ActionCommands';
import Table from '../../../components/table/Table';

function CustomActionCommands(props: ActionCommandsProps) {
  const confirm = useConfirm();
  return (
    <ActionCommands
      {...props}
      showCopy={false}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onDelete={async () => {
        await confirm({ description: 'Are you sure you want to do this custom action?' });
      }}
    >
      {() => (
        <>
          <Divider />
          <Table.MoreMenuItem title="Custom Menu" Icon={SaveAltOutlined} />
        </>
      )}
    </ActionCommands>
  );
}

export default CustomActionCommands;
