import { ReactNode, useState } from 'react';

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
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    panels.filter((panel) => panel.defaultExpanded).map((panel) => panel.key) || [],
  );
  const panelContent = panels.map(({ detailsProps, ...panel }) => {
    const isExpanded = selectedKeys.includes(panel.key);
    return (
      <Accordion
        {...panel}
        key={panel.key}
        expanded={isExpanded}
        onChange={(_e, expanded) => {
          setSelectedKeys((prev) => {
            if (expanded) {
              return [...prev, panel.key];
            }
            return prev.filter((key) => key !== panel.key);
          });
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>{panel.label}</AccordionSummary>
        {isExpanded ? (
          <AccordionDetails {...detailsProps}>{panel.children}</AccordionDetails>
        ) : null}
      </Accordion>
    );
  });

  return <Page.Content {...boxProps}>{panelContent}</Page.Content>;
}

export default DefaultPanels;
