import React, { useState } from 'react';

import { formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Import React FilePond
import { FilePond } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

import styles from './fileUploadDialog.module.scss';

export default function AlertDialog({ open, onResponse }) {
  const [file, setFile] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [data, setData] = useState(formatISO(Date.now()));

  const handleCancel = () => {
    onResponse(false, {});
  };
  const handleOk = () => {
    if (!nome || !desc) return;
    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('nome', nome);
    formData.append('desc', desc);
    formData.append('data', data);

    setNome('');
    setDesc('');
    setFile([]);
    setData(formatISO(Date.now()));
    onResponse(true, formData);
  };

  const onFileChange = (files) => {
    const items = files.map((fileItem) => fileItem.file);
    setFile(items);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upload de arquivo</DialogTitle>
        <DialogContent>
          <div className={styles.dialogContentWrapper}>
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                className={styles.field}
                id="nome"
                label="Nome"
                value={nome}
                required
                onChange={(event) => setNome(event.target.value)}
              />
              <TextField
                className={styles.field}
                id="desc"
                label="Descrição"
                value={desc}
                required
                onChange={(event) => setDesc(event.target.value)}
              />

              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                <KeyboardDatePicker
                  className={styles.field}
                  id="data"
                  style={{ width: '100%' }}
                  format="dd/MM/yyyy"
                  label="Data do arquivo"
                  value={data}
                  onChange={(dataChanged) => {
                    // @ts-ignore
                    if (dataChanged == 'Invalid Date' || dataChanged == null) return;
                    setData(formatISO(dataChanged || Date.now()));
                  }}
                />
              </MuiPickersUtilsProvider>
              <FilePond
                className={styles.field}
                files={file}
                onupdatefiles={onFileChange}
                allowMultiple={false}
                server={null}
                required
                // name="files" {/* sets the file input name, it's filepond by default */}
                labelIdle='Arraste arquivos aqui ou <span class="filepond--label-action">Procure no seu computador</span>'
              />
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleOk} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
