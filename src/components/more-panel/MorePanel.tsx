import React, { PropsWithChildren, useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, ButtonBase, Stack, StackProps, styled } from '@mui/material';

import { FlexBetween } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import { Tiny } from '../typography';

export interface MorePanelProps extends StackProps {
  initialVisibility?: boolean;
  extraContent?: React.ReactNode;
}

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  padding: 2,
  paddingRight: 10,
  textAlign: 'left',
  borderRadius: 30,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

function MorePanel({
  children,
  initialVisibility = false,
  extraContent,
  ...boxProps
}: PropsWithChildren<MorePanelProps>) {
  const { t } = useTranslation();
  const [showMore, setshowMore] = useState<boolean>(initialVisibility);

  return (
    <>
      {showMore ? children : null}
      <FlexBetween alignItems="center" width="100%" p={1.5}>
        {extraContent ?? <Box />}
        <StyledButtonBase disableRipple>
          <Stack
            flexDirection="row"
            alignItems="center"
            {...boxProps}
            onClick={() => setshowMore((p) => !p)}
          >
            {showMore ? (
              <>
                <ExpandLessIcon sx={{ color: 'text.secondary' }} />
                <Tiny color="text.secondary" fontWeight={600}>
                  {t('show_less')}
                </Tiny>
              </>
            ) : (
              <>
                <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
                <Tiny color="text.secondary" fontWeight={600}>
                  {t('show_more')}
                </Tiny>
              </>
            )}
          </Stack>
        </StyledButtonBase>
      </FlexBetween>
    </>
  );
}

export default MorePanel;