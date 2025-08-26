import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button, ButtonProps } from '@/components/ui/button';

interface CustomButton extends ButtonProps {
  label: string;
  onClick: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  buttons?: CustomButton[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, buttons }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
        <DialogFooter>
          {footer}
          {buttons && buttons.map((button, index) => (
            <Button
              key={index}
              {...button}
            >
              {button.label}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
