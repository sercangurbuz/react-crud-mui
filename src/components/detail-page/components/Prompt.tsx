import useFormPrompt, { UseFormPromptProps } from '../hooks/useFormPrompt';

type PromptProps = UseFormPromptProps;

function Prompt(props: PromptProps) {
  useFormPrompt(props);
  return null;
}

export default Prompt;
