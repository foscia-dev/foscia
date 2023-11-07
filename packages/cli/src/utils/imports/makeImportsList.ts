type ImportItemOptions = {
  isDefault?: boolean;
  isTypeOnly?: boolean;
};

export type ImportItem = {
  name: string;
  from: string;
  isDefault?: boolean;
  isTypeOnly?: boolean;
};

export type ImportsList = {
  readonly imports: ImportItem[];
  add: (name: string, from: string, options?: ImportItemOptions) => string;
};

export default function makeImportsList(): ImportsList {
  const imports = [] as ImportItem[];

  return {
    imports,
    add(name: string, from: string, options?: ImportItemOptions) {
      imports.push({ name, from, ...options });

      return name;
    },
  };
}
