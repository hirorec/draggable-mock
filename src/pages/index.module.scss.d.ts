export type Styles = {
  boxContainer: string;
  columnContainer: string;
  container: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
