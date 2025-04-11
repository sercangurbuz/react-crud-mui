import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import { Apps } from '@mui/icons-material';
import { Box, BoxProps, Card, CardProps, Drawer, Theme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { FlexBox } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import { StyledButton } from './styles';

export type SidePanelItem = {
  key: string;
  name: string;
  icon?: React.ReactNode;
  link?: string;
};

export interface SidePanelProps extends BoxProps {
  items: SidePanelItem[];
  activeKey?: string;
  onItemClick?: (item: SidePanelItem) => void;
  drawerToggler?: React.ReactNode;
}

function SidePanel({ items, activeKey, onItemClick, drawerToggler, ...boxProps }: SidePanelProps) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleListItemBtn = (item: SidePanelItem) => () => {
    onItemClick?.(item);
    setOpenDrawer(false);
  };

  const renderItems = () => {
    return (
      <FlexBox flexDirection="column">
        {items?.map((item) => (
          <StyledButton
            key={item.key}
            variant="text"
            startIcon={item.icon}
            active={activeKey === item.key}
            onClick={handleListItemBtn(item)}
          >
            {item.link ? (
              <Link to={item.link} style={{ color: 'inherit' }}>
                {item.name}
              </Link>
            ) : (
              item.name
            )}
          </StyledButton>
        ))}
      </FlexBox>
    );
  };

  if (downMd) {
    const toggler = drawerToggler || (
      <>
        <Apps sx={{ color: 'text.primary', fontSize: 16 }} />
        <Typography variant="body2" fontWeight={500}>
          {t('more')}
        </Typography>
      </>
    );

    return (
      <Fragment>
        <Box
          onClick={() => setOpenDrawer(true)}
          sx={{
            gap: 0.5,
            cursor: 'pointer',
            alignItems: 'center',
            display: 'inline-flex',
            color: 'text.secondary',
          }}
        >
          {toggler}
        </Box>

        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <Box p={1} {...boxProps}>
            {renderItems()}
          </Box>
        </Drawer>
      </Fragment>
    );
  }

  return (
    <Card {...(boxProps as CardProps)} sx={{ p: '1rem 0', ...boxProps?.sx }}>
      {renderItems()}
    </Card>
  );
}

export default SidePanel;
