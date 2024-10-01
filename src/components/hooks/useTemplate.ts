import { useRef } from 'react';

import template from 'lodash.template';

export interface TemplateOptions {
  /**
   * Custom lodash template to display combined text.<%= first_name %> <%= last_name %> e.g.
   */
  displayTemplate?: string;
  /**
   * Custom lodash template to display combined text.<%= first_name %> <%= last_name %> e.g.
   */
  descTemplate?: string;
}

export type UseTemplateOptions = TemplateOptions;

export default ({ displayTemplate, descTemplate }: UseTemplateOptions) => {
  const templateFn = useRef<ReturnType<typeof template> | undefined>();
  const descTemplateFn = useRef<ReturnType<typeof template> | undefined>();

  //set template fn
  if (displayTemplate && !templateFn.current) {
    templateFn.current = template(displayTemplate);
  }
  //set desc template fn
  if (descTemplate && !descTemplateFn.current) {
    descTemplateFn.current = template(descTemplate);
  }

  return [templateFn.current, descTemplateFn.current] as const;
};
