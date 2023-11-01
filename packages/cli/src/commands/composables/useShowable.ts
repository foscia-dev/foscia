import pc from 'picocolors';

export type ShowableOptions = {
  show?: boolean;
};

export default function useShowable() {
  const options = {
    show: {
      type: 'boolean',
      description: pc.dim('Show the generated code instead of writing a file.'),
    },
  } as const;

  const getShow = (args: ShowableOptions) => args.show ?? false;

  return [options, getShow] as const;
}
