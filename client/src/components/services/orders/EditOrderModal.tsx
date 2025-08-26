import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrder, deleteOrder } from '@/app/reducers/OrdersReducers';
import { AppDispatch } from '@/app/store';
import { Order } from '@/components/services/types/orders';
import Modal from '@/components/shared/Modal';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

function EditOrderModal({ isOpen, onClose, order }: EditOrderModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [orderData, setOrderData] = useState<Order | null>(null);

  useEffect(() => {
    if (order) {
      setOrderData({
        ...order,
        date: order.date ? new Date(order.date).toISOString().split('T')[0] : ''
      });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!orderData) return;
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setOrderData({ ...orderData, [e.target.name]: value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    if (!orderData) return;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = () => {
    if (orderData) {
      dispatch(updateOrder(orderData));
      onClose();
    }
  };

  const handleDelete = () => {
    if (orderData && orderData.id) {
      const confirmDelete = window.confirm('Voulez-vous vraiment supprimer la commande ?');
      if (confirmDelete) {
        dispatch(deleteOrder(orderData.id));
        onClose();
      }
    }
  };

  if (!orderData) return null;

  const modalContent = (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='customer_name'>Nom du client</Label>
          <Input
            id='customer_name'
            name='customer_name'
            value={orderData.customer_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor='customer_email'>Email du client</Label>
          <Input
            id='customer_email'
            name='customer_email'
            type='email'
            value={orderData.customer_email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor='type'>Type de commande</Label>
          <Select onValueChange={handleSelectChange('type')} value={orderData.type || ''}>
            <SelectTrigger>
              <SelectValue placeholder='Sélectionnez un type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Standard'>Standard</SelectItem>
              <SelectItem value='Express'>Express</SelectItem>
              <SelectItem value='Premium'>Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='amount'>Montant</Label>
          <Input
            id='amount'
            name='amount'
            type='number'
            value={orderData.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor='status'>Statut</Label>
          <Select onValueChange={handleSelectChange('status')} value={orderData?.status || ''}>
            <SelectTrigger>
              <SelectValue placeholder='Sélectionnez un statut' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Livré'>Livrée</SelectItem>
              <SelectItem value='En cours'>En cours</SelectItem>
              <SelectItem value='Annulé'>Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='date'>Date</Label>
          <Input
            id='date'
            name='date'
            type='date'
            value={orderData?.date || ''}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </form>
  );



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier la commande"
      buttons={[
        {
          label: 'Supprimer la commande',
          onClick: handleDelete,
          variant: 'destructive' as const,
        },
        {
          label: 'Enregistrer les modifications',
          onClick: handleSubmit,
        }
      ]}
    >
      {modalContent}
    </Modal>
  );
}

export default EditOrderModal;
