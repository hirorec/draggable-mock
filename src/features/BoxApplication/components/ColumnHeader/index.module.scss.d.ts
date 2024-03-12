export type Styles = {
  cols: string;
  header: string;
  headerCell: string;
  headerNav: string;
  headerNavInner: string;
  navButton: string;
  next: string;
  prev: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
