import React, { PropsWithChildren, ReactNode, useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { FlexBetween } from '../flexbox';
import { FlexBoxProps } from '../flexbox/FlexBox';
import useTranslation from '../i18n/hooks/useTranslation';
import { Small } from '../typography';

export interface MorePanelProps extends FlexBoxProps {
  initialVisibility?: boolean;
  extraContent?: React.ReactNode;
  moreText?: ReactNode;
  lessText?: ReactNode;
}

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  padding: 3,
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
  moreText,
  lessText,
  ...boxProps
}: PropsWithChildren<MorePanelProps>) {
  const { t } = useTranslation();
  const [showMore, setshowMore] = useState<boolean>(initialVisibility);

  return (
    <>
      {showMore ? children : null}
      <FlexBetween alignItems="center" width="100%" p={1.5} {...boxProps}>
        {extraContent ?? <Box />}
        <StyledButtonBase disableRipple>
          <Stack flexDirection="row" alignItems="center" onClick={() => setshowMore((p) => !p)}>
            {showMore ? (
              <>
                <ExpandLessIcon sx={{ color: 'text.secondary', fontSize: '1.5em' }} />
                <Small color="text.secondary" fontWeight={600}>
                  {lessText ?? t('show_less')}
                </Small>
              </>
            ) : (
              <>
                <ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: '1.5em' }} />
                <Small color="text.secondary" fontWeight={600}>
                  {moreText ?? t('show_more')}
                </Small>
              </>
            )}
          </Stack>
        </StyledButtonBase>
      </FlexBetween>
    </>
  );
}

export default MorePanel;
