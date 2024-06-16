export type ForceableOptions = {
  force?: boolean;
};

export const useForceOption = ['--force', 'Force overwriting existing files'] as const;

export function useForce(options: ForceableOptions) {
  return options.force ?? false;
}
