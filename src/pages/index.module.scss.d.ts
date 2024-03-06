export type Styles = {
  boxContainer: string;
  column: string;
  columnBg: string;
  columnBgBorder: string;
  columnContainer: string;
  container: string;
  containerInner: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
