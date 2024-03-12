export type Styles = {
  header: string;
  headerInner: string;
  headerRow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
