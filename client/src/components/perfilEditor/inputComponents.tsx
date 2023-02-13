/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
import React, { useState } from 'react';

import { TextField, InputAdornment, Popover } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { SketchPicker } from 'react-color';

import { LayerProps } from '../../types/perfilEditor.types';

import styles from './perfilEditor.module.scss';

const FGDC_TEXTURES = [
  120,
  123,
  132,
  601,
  602,
  603,
  605,
  606,
  607,
  608,
  609,
  610,
  611,
  612,
  613,
  614,
  616,
  617,
  618,
  619,
  620,
  621,
  622,
  623,
  624,
  625,
  626,
  627,
  628,
  629,
  630,
  631,
  632,
  633,
  634,
  635,
  636,
  637,
  638,
  639,
  640,
  641,
  642,
  643,
  644,
  645,
  646,
  647,
  648,
  649,
  650,
  651,
  652,
  653,
  654,
  655,
  656,
  657,
  658,
  659,
  660,
  661,
  662,
  663,
  664,
  665,
  666,
  667,
  668,
  669,
  670,
  671,
  672,
  673,
  674,
  675,
  676,
  677,
  678,
  679,
  680,
  681,
  682,
  683,
  684,
  685,
  686,
  701,
  702,
  703,
  704,
  705,
  706,
  707,
  708,
  709,
  710,
  711,
  712,
  713,
  714,
  715,
  716,
  717,
  718,
  719,
  720,
  721,
  722,
  723,
  724,
  725,
  726,
  727,
  728,
  729,
  730,
  731,
  732,
  733,
];

export const GeologicLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { from, to, color, fgdc_texture, description, geologic_unit } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <Autocomplete
          id="combo-box-demo"
          className={styles.layerInput}
          options={FGDC_TEXTURES}
          value={fgdc_texture}
          onChange={(event, newValue) => {
            updateValues({ ...component, fgdc_texture: newValue });
          }}
          getOptionLabel={(option) => option.toString()}
          // style={{ width: 300 }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} variant="standard" label="Textura" />}
        />
      </div>
      <div className={`${styles.colorInput} ${styles.layerInput}`}>
        <span>Cor da Camada:</span>
        <div
          aria-describedby={id}
          style={{ backgroundColor: color }}
          className={styles.colorBtn}
          onClick={handleClick}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <SketchPicker
            className={styles.colorPicker}
            disableAlpha
            color={color}
            onChange={(newColor, event) => {
              updateValues({ ...component, color: newColor.hex });
            }}
          />
        </Popover>
      </div>

      <TextField
        size="small"
        variant="standard"
        className={styles.layerInput}
        id="standard-multiline-flexible"
        label="Unidade Geológica"
        style={{ width: '100%' }}
        multiline
        value={geologic_unit}
        onChange={(event) => {
          // eslint-disable-next-line implicit-arrow-linebreak
          updateValues({ ...component, geologic_unit: event.target.value });
        }}
      />
      <TextField
        size="small"
        variant="standard"
        className={styles.layerInput}
        id="standard-multiline-flexible"
        label="Descrição"
        style={{ width: '100%' }}
        multiline
        value={description}
        onChange={(event) => {
          // eslint-disable-next-line implicit-arrow-linebreak
          updateValues({ ...component, description: event.target.value });
        }}
      />
    </div>
  );
};

export const HoleFillLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const { from, to, type, diam_pol, description } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Diâmetro"
          InputProps={{
            endAdornment: <InputAdornment position="end">pol</InputAdornment>,
          }}
          type="number"
          value={diam_pol}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, diam_pol: parseFloat(event.target.value) });
          }}
        />
      </div>
      <FormControl className={styles.radioInput} component="fieldset">
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          className={styles.radioEA}
          aria-label="tipo"
          defaultValue={type}
          name="radio-buttons-group"
          row
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, type: event.target.value });
          }}
        >
          <FormControlLabel value="seal" control={<Radio />} label="Cimentação" />
          <FormControlLabel value="gravel_pack" control={<Radio />} label="Pré-Filtro" />
        </RadioGroup>
      </FormControl>
      <TextField
        size="small"
        variant="standard"
        className={styles.layerInput}
        id="standard-multiline-flexible"
        label="Descrição"
        value={description}
        onChange={(event) => {
          // eslint-disable-next-line implicit-arrow-linebreak
          updateValues({
            ...component,
            description: event.target.value,
          });
        }}
      />
    </div>
  );
};

export const WellCaseLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const { from, to, type, diam_pol } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Diâmetro"
          InputProps={{
            endAdornment: <InputAdornment position="end">pol</InputAdornment>,
          }}
          type="number"
          value={diam_pol}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, diam_pol: parseFloat(event.target.value) });
          }}
        />
      </div>
      <TextField
        size="small"
        variant="standard"
        className={styles.layerInput}
        id="standard-multiline-flexible"
        label="Tipo"
        value={type}
        onChange={(event) => {
          // eslint-disable-next-line implicit-arrow-linebreak
          updateValues({ ...component, type: event.target.value });
        }}
      />
    </div>
  );
};

export const BoreHoleLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const { from, to, diam_pol } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Diâmetro"
          InputProps={{
            endAdornment: <InputAdornment position="end">pol</InputAdornment>,
          }}
          type="number"
          value={diam_pol}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, diam_pol: parseFloat(event.target.value) });
          }}
        />
      </div>
    </div>
  );
};

export const SurfaceCaseLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const { to, from, diam_pol } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Diâmetro"
          InputProps={{
            endAdornment: <InputAdornment position="end">pol</InputAdornment>,
          }}
          type="number"
          value={diam_pol}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, diam_pol: parseFloat(event.target.value) });
          }}
        />
      </div>
    </div>
  );
};

export const WellScreenLayer = ({ component, index, onChangeValues }: LayerProps) => {
  const { from, to, type, diam_pol, screen_slot_mm } = component;
  const updateValues = (newLayer) => {
    onChangeValues(newLayer, index);
  };
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.layerRow}>
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="De"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          type="number"
          value={from}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, from: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Até"
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          type="number"
          value={to}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, to: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Diâmetro"
          InputProps={{
            endAdornment: <InputAdornment position="end">pol</InputAdornment>,
          }}
          type="number"
          value={diam_pol}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, diam_pol: parseFloat(event.target.value) });
          }}
        />
        <TextField
          size="small"
          variant="standard"
          className={styles.layerInput}
          id="standard-multiline-flexible"
          label="Ranhura"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">mm</InputAdornment>,
          }}
          value={screen_slot_mm}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            updateValues({ ...component, screen_slot_mm: parseFloat(event.target.value) });
          }}
        />
      </div>
      <TextField
        size="small"
        variant="standard"
        className={styles.layerInput}
        id="standard-multiline-flexible"
        label="Tipo"
        value={type}
        onChange={(event) => {
          // eslint-disable-next-line implicit-arrow-linebreak
          updateValues({ ...component, type: event.target.value });
        }}
      />
    </div>
  );
};
