import { ReactNode } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

/**
 * A wrapper component for react-hook-form's useFormContext, which provides the form context to its children.
 * It accepts a render prop as its child, which receives the form context as an argument.
 *
 * @param props - The props for the FieldSet component.
 * @returns A React element that renders the children with the form context.
 */
function FieldSet<TFieldValues extends FieldValues = FieldValues>(props: {
  children: (context: ReturnType<typeof useFormContext<TFieldValues>>) => ReactNode;
}) {
  const context = useFormContext<TFieldValues>();
  return <>{props.children(context)}</>;
}

export default FieldSet;
