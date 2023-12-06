import { useState } from 'react';

export const useModalController = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return { isModalOpen: isOpen, openModal, closeModal };
};
