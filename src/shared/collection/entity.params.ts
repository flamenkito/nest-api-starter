export interface EntityParams<Model> {
  name: string;
  index: string[];
  fromArgs: (args: any) => Model;
}
