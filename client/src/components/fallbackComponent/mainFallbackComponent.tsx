import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core/';

import { FallbackProps } from 'react-error-boundary';

import Alert from '../alert/alert.component';

export default function ({ error }: FallbackProps) {
  const [showSnackBar, setShowSnackBar] = useState(true);

  let snackbarMsg = 'Houve uma falha no sistema. Recarregue a pagina e tente mais tarde';
  let msg = 'Tivemos uma falha :(';
  let secondaryMsg = 'Tente recarregar a página';

  console.log({ error });
  if (error.message === 'Failed to fetch') {
    snackbarMsg = 'Falha na comunicação com os servidores';
    msg = 'Houve falha de comunicação nos nossos serviços';
    secondaryMsg =
      'Talvez você esteja offline, verifique sua conexão. Após, recarregue a página e tente novamente após um tempo. Se o erro persistir entre em contato conosco';
  }

  return (
    <div>
      <Snackbar open={showSnackBar} autoHideDuration={6000} onClose={() => setShowSnackBar(false)}>
        <Alert onClose={() => setShowSnackBar(false)} severity="error">
          {snackbarMsg}
        </Alert>
      </Snackbar>
      <h1>{msg}</h1>
      <p>{secondaryMsg}</p>
    </div>
  );
}
