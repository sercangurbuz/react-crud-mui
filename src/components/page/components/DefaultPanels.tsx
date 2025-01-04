import { ReactNode } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummary,
} from '@mui/material';

import Page from '../Page';

export type PanelPane = Omit<AccordionProps, 'children' | 'key'> & {
  children?: ReactNode;
  label?: ReactNode;
  key: string;
  detailsProps?: AccordionDetailsProps;
};

export interface DefaultAccordionsProps {
  panels: PanelPane[];
}

function DefaultPanels({ panels }: DefaultAccordionsProps) {
  const panelContent = panels.map(({ detailsProps, ...panel }) => (
    <Accordion {...panel} key={panel.key}>
      <AccordionSummary expandIcon={<ExpandMore />}>{panel.label}</AccordionSummary>
      <AccordionDetails {...detailsProps}>{panel.children}</AccordionDetails>
    </Accordion>
  ));

  return <Page.Content>{panelContent}</Page.Content>;
}

export default DefaultPanels;
