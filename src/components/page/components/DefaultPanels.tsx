import { ReactNode } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { BoxProps } from '@mui/material/Box';

import Page from '../Page';

export type PanelPane = Omit<AccordionProps, 'children' | 'key'> & {
  children?: ReactNode;
  footer?: ReactNode;
  label?: ReactNode;
  key: string;
  detailsProps?: AccordionDetailsProps;
};

export interface DefaultAccordionsProps extends BoxProps {
  panels: PanelPane[];
}

function DefaultPanels({ panels, ...boxProps }: DefaultAccordionsProps) {
  const panelContent = panels.map(({ detailsProps, ...panel }) => (
    <Accordion {...panel} key={panel.key}>
      <AccordionSummary expandIcon={<ExpandMore />}>{panel.label}</AccordionSummary>
      <AccordionDetails {...detailsProps}>{panel.children}</AccordionDetails>
    </Accordion>
  ));

  return <Page.Content {...boxProps}>{panelContent}</Page.Content>;
}

export default DefaultPanels;
