export type Styles = {
  box: string;
  boxInner: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
