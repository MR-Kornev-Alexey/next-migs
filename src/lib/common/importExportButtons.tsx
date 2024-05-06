import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import {Upload as UploadIcon} from "@phosphor-icons/react/dist/ssr/Upload";
import {Download as DownloadIcon} from "@phosphor-icons/react/dist/ssr/Download";
export interface ImportExportButtonsProps {
  onImportClick: () => void;
  onExportClick: () => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ onImportClick, onExportClick }) => {
  return (
  <Stack direction="row" spacing={3}>
    <Stack spacing={1} sx={{flex: '1 1 auto'}}>
      <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
        <Button onClick={onImportClick} color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"/>}>
          Импорт
        </Button>
        <Button   onClick={onExportClick}  color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)"/>}>
          Экспорт
        </Button>
      </Stack>
    </Stack>
  </Stack>
  );
};

export default ImportExportButtons;
