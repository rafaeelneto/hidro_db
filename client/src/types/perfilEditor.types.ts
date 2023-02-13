export type onChangeValuesType = (newComponent: any, index: number) => void;
export type onChangeListType = (newComponents: any[]) => void;
export type LayerProps = {
  component: any;
  index: number;
  onChangeValues: onChangeValuesType;
};
