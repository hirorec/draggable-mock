export type Styles = {
  cols: string;
  container: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
