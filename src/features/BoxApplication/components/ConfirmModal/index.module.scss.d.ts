export type Styles = {
  boxInfo: string;
  button: string;
  cancel: string;
  modal: string;
  modalContainer: string;
  modalContainerFooter: string;
  ok: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
