import { useRef } from 'react';

import template from 'lodash.template';

export interface TemplateOptions {
  displayTemplate?: string;
  descriptionTemplate?: string;
  optionTemplate?: string;
}

export type UseTemplateOptions = TemplateOptions;

function useComboboxTemplate({
  optionTemplate,
  displayTemplate,
  descriptionTemplate,
}: UseTemplateOptions) {
  const displayTemplateFn = useRef<ReturnType<typeof template> | undefined>();
  const descTemplateFn = useRef<ReturnType<typeof template> | undefined>();
  const optionTemplateFn = useRef<ReturnType<typeof template> | undefined>();

  //set template fn
  if (displayTemplate && !displayTemplateFn.current) {
    displayTemplateFn.current = template(displayTemplate);
  }
  //set desc template fn
  if (descriptionTemplate && !descTemplateFn.current) {
    descTemplateFn.current = template(descriptionTemplate);
  }

  if (optionTemplate && !optionTemplateFn.current) {
    optionTemplateFn.current = template(optionTemplate);
  }

  return [optionTemplateFn.current, displayTemplateFn.current, descTemplateFn.current] as const;
}

export default useComboboxTemplate;
