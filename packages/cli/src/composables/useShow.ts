export type ShowableOptions = {
  show?: boolean;
};

export const useShowOption = ['--show', 'Show files instead of writing to disk'] as const;

export function useShow(options: ShowableOptions) {
  return options.show ?? false;
}
