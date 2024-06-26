import React, {useEffect, useState} from 'react';
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
} from '@mui/material';
import {X} from "@phosphor-icons/react";
import EmissionResultForOneSensor from "@/components/tables/emission-result-for-one-sensor";

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 3,
};

interface Organization {
  id: string;
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

interface Sensor {
  id: string;
  object_id: string;
  sensor_type: string;
  sensor_key: string;
  model: string;
  ip_address: string;
  designation: string;
  network_number: number;
  notation: string;
  run: boolean;
}

interface EmissionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  idObject: string;
  model: string;
  allObjects: EmissionResultModal[];
  allSensors: Sensor[];
}

interface EmissionResultModal {
  id: string;
  organization_id: string;
  objectsType: string;
  objectsMaterial: string;
  geo: string;
  name: string;
  address: string;
  notation: string;
  set_null: boolean;
  periodicity: number;
  organization: Organization;
  Sensor: Sensor[];
}

const EmissionResultModal: React.FC<EmissionResultModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   idObject,
                                                                   model,
                                                                   allObjects,
                                                                   allSensors,
                                                                 }) => {
  const [selectedObject, setSelectedObject] = useState<EmissionResultModal | null>(null);
  const [selectedSensors, setSelectedSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    if (isOpen) {
      const foundObj = allObjects.find((obj) => obj.id === idObject) || null;
      const filteredSensors = allSensors.filter(
        (sensor) => sensor.object_id === idObject && sensor.model === model
      );
      setSelectedObject(foundObj);
      setSelectedSensors(filteredSensors);
    }
  }, [isOpen, idObject, model, allObjects, allSensors]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{backdrop: Backdrop}}
      slotProps={{
        backdrop: {
          timeout: 1000,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle}>
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <X size={32} onClick={onClose} style={{cursor: "pointer"}}/>
          </Box>
          {selectedObject && (
            <Typography variant={"body2"}>
              Данные для дачиков модели <strong>{selectedSensors[0]?.model}</strong> на
              объекте <strong> "{selectedObject.name} {selectedObject.address}" </strong>
            </Typography>
            )}
          <EmissionResultForOneSensor rows={selectedSensors}/>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EmissionResultModal;
