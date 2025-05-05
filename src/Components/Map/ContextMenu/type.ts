export interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ContextMenuStateType{
      visible: boolean;
      x: number;
      y: number;
      Index: number;
    }