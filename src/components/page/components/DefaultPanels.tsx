import { ReactNode } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { BoxProps } from '@mui/material/Box';

import { isDark } from '../../theme/theme.constants';
import Page from '../Page';

export type PanelPane = Omit<AccordionProps, 'children' | 'key'> & {
  children?: ReactNode;
  footer?: ReactNode;
  label?: ReactNode;
  key: string;
  detailsProps?: AccordionDetailsProps;
};

export const AccordionFooter = styled('div')(({ theme }) => ({
  padding: 16,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
}));

export interface DefaultAccordionsProps extends BoxProps {
  panels: PanelPane[];
}

function DefaultPanels({ panels, ...boxProps }: DefaultAccordionsProps) {
  const panelContent = panels.map(({ detailsProps, ...panel }) => (
    <Accordion {...panel} key={panel.key}>
      <AccordionSummary expandIcon={<ExpandMore />}>{panel.label}</AccordionSummary>
      <AccordionDetails {...detailsProps}>{panel.children}</AccordionDetails>
      <AccordionFooter>{panel.footer}</AccordionFooter>
    </Accordion>
  ));

  return <Page.Content {...boxProps}>{panelContent}</Page.Content>;
}

export default DefaultPanels;
