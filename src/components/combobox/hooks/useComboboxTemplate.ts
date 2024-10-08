import { ReactNode, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

import template from 'lodash.template';

export type ComboboxTemplateFn<T extends FieldValues> = (model: T) => ReactNode;
export type ComboboxTemplate<T extends FieldValues> = string | ComboboxTemplateFn<T>;
export interface UseComboboxTemplateOptions<T extends FieldValues> {
  displayTemplate?: ComboboxTemplate<T>;
  descriptionTemplate?: ComboboxTemplate<T>;
  optionTemplate: ComboboxTemplate<T>;
}

export interface UseComboboxTemplateReturn<T extends FieldValues> {
  renderDisplay?: ComboboxTemplateFn<T>;
  renderDescription?: ComboboxTemplateFn<T>;
  renderOption: ComboboxTemplateFn<T>;
}

function useComboboxTemplate<T extends FieldValues>({
  optionTemplate,
  displayTemplate,
  descriptionTemplate,
}: UseComboboxTemplateOptions<T>): UseComboboxTemplateReturn<T> {
  const displayTemplateFn = useRef<ReturnType<typeof template> | undefined>();
  const descTemplateFn = useRef<ReturnType<typeof template> | undefined>();
  const optionTemplateFn = useRef<ReturnType<typeof template> | undefined>();

  //set template fn
  if (typeof displayTemplate === 'string' && !displayTemplateFn.current) {
    displayTemplateFn.current = template(displayTemplate);
  }

  if (typeof optionTemplate === 'string' && !optionTemplateFn.current) {
    optionTemplateFn.current = template(optionTemplate);
  }

  if (typeof descriptionTemplate === 'string' && !descTemplateFn.current) {
    descTemplateFn.current = template(descriptionTemplate);
  }

  return {
    renderOption: optionTemplateFn.current ?? (optionTemplate as ComboboxTemplateFn<T>),
    renderDisplay: displayTemplateFn.current ?? (displayTemplate as ComboboxTemplateFn<T>),
    renderDescription: descTemplateFn.current ?? (descriptionTemplate as ComboboxTemplateFn<T>),
  };
}

export default useComboboxTemplate;
