import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { Prescription } from '@/app/reducers/PrescriptionsReducer';

interface PrescriptionActionsProps {
  prescription: Prescription;
}

const PrescriptionActions: React.FC<PrescriptionActionsProps> = ({ prescription }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date((dateString || '') + 'T00:00:00');
      return isNaN(date.getTime())
        ? 'Date non définie'
        : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'Date non définie';
    }
  };

  const buildPrescriptionHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Ordonnance #${prescription.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .prescription-info { margin-bottom: 30px; }
            .medications { margin-bottom: 30px; }
            .medication-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 20mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Ordonnance #${prescription.id}</h1>
            <p>Date: ${formatDate(prescription.prescriptionDate)}</p>
            <p>Statut: ${prescription.status || 'N/A'}</p>
          </div>
          <div class="prescription-info">
            <h3>Informations</h3>
            <p><strong>Patient:</strong> ${prescription.patient?.name || 'N/A'}</p>
            <p><strong>Espèce:</strong> ${prescription.patient?.species || 'N/A'}</p>
            <p><strong>Vétérinaire:</strong> ${prescription.practitioner?.name || 'N/A'}</p>
            ${prescription.notes ? `<p><strong>Notes:</strong> ${prescription.notes}</p>` : ''}
          </div>
          <div class="medications">
            <h3>Médicaments prescrits</h3>
            ${prescription.items.map(item => `
              <div class="medication-item">
                <h4>${item.medicationName || 'Médicament non défini'}</h4>
                <p><strong>Posologie:</strong> ${item.dosage || 'Non définie'}</p>
                <p><strong>Fréquence:</strong> ${item.frequency || 'Non définie'}</p>
                <p><strong>Durée:</strong> ${item.duration || 'Non définie'}</p>
                ${item.instructions ? `<p><strong>Instructions:</strong> ${item.instructions}</p>` : ''}
                <p><strong>Quantité:</strong> ${(item.quantity ?? '').toString() || 'Non définie'} ${item.unit || ''}</p>
              </div>
            `).join('')}
          </div>
          <div class="footer">
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </body>
      </html>
    `;
  };

  // Télécharger en PDF via la boîte de dialogue d'impression (fiable sur tous navigateurs)
  const handleDownloadPDF = () => {
    const html = buildPrescriptionHTML();
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
  };

  const handlePrint = () => {
    const html = buildPrescriptionHTML();
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
  };

  return (
    <div className="flex gap-3">
      <Button className="flex-1 bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white" onClick={handleDownloadPDF}>
        <Download className="w-4 h-4 mr-2" /> Télécharger (PDF)
      </Button>
      <Button variant="outline" className="flex-1 border-[#4F7AF4] text-[#4F7AF4]" onClick={handlePrint}>
        <Printer className="w-4 h-4 mr-2" /> Imprimer
      </Button>
    </div>
  );
};

export default PrescriptionActions;
