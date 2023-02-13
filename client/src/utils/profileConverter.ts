import { PROFILE_TYPE } from '../types/perfil.types';

const PROFILE_DEFAULT: PROFILE_TYPE = {
  geologic: [],
  constructive: {
    bole_hole: [],
    well_screen: [],
    surface_case: [],
    well_case: [],
    hole_fill: [],
    cement_pad: {
      type: '',
      width: 0,
      thickness: 0,
      length: 0,
    },
  },
};

export default (perfil) => {
  let perfilImported: any = {};
  perfilImported = perfil;

  let noPerfil = true;
  if (perfilImported.geologic && perfilImported.constructive) {
    noPerfil =
      perfilImported.geologic.length === 0 &&
      perfilImported.constructive.bole_hole.length === 0 &&
      perfilImported.constructive.hole_fill.length === 0 &&
      perfilImported.constructive.well_screen.length === 0;
  }

  if (noPerfil) {
    const perfilConverted: any = JSON.parse(JSON.stringify(PROFILE_DEFAULT));

    if (perfilImported.geologico || perfilImported.construtivo) {
      if (perfilImported.geologico.length > 0) {
        perfilConverted.geologic = perfilImported.geologico.map((camada) => ({
          from: parseFloat(camada.de),
          to: parseFloat(camada.ate),
          fgdc_texture: camada.fgdc_texture || '',
          color: camada.color || '',
          description: camada.descricao || '',
          geologic_unit: camada.unidade_geologica || '',
        }));
      }
      if (perfilImported.construtivo.furo.length > 0) {
        perfilConverted.constructive.bole_hole = perfilImported.construtivo.furo.map((camada) => ({
          from: parseFloat(camada.de),
          to: parseFloat(camada.ate),
          diam_pol: parseFloat(camada.diam_pol) || 0,
        }));
      }
      if (perfilImported.construtivo.espaco_anelar.length > 0) {
        perfilConverted.constructive.hole_fill = perfilImported.construtivo.espaco_anelar.map(
          (camada) => {
            let tipo = 'gravel_pack';
            if (camada.tipo === 'cimento') {
              tipo = 'seal';
            }
            return {
              from: parseFloat(camada.de),
              to: parseFloat(camada.ate),
              diam_pol: parseFloat(camada.diam_pol) || 0,
              description: camada.descricao || '',
              // eslint-disable-next-line eqeqeq
              type: tipo,
            };
          },
        );
      }
      if (perfilImported.construtivo.filtros.length > 0) {
        perfilConverted.constructive.well_screen = perfilImported.construtivo.filtros.map(
          (camada) => ({
            from: parseFloat(camada.de),
            to: parseFloat(camada.ate),
            type: camada.tipo || '',
            diam_pol: parseFloat(camada.diam_pol) || 0,
            screen_slot_mm: parseFloat(camada.ranhura_mm) || 0,
          }),
        );
      }
      if (perfilImported.construtivo.revestimento.length > 0) {
        perfilConverted.constructive.well_case = perfilImported.construtivo.revestimento.map(
          (camada) => ({
            from: parseFloat(camada.de),
            to: parseFloat(camada.ate),
            type: camada.tipo || '',
            diam_pol: parseFloat(camada.diam_pol) || 0,
          }),
        );
      }
      if (perfilImported.construtivo.tubo_boca.length > 0) {
        perfilConverted.constructive.surface_case = perfilImported.construtivo.tubo_boca.map(
          (camada) => {
            const depth = parseFloat(camada.altura) || parseFloat(camada.depth) || 0;
            return {
              from: camada.from || 0,
              to: camada.to || depth,
              diam_pol: parseFloat(camada.diam_pol) || 0,
            };
          },
        );
      }
      if (perfilImported.construtivo.laje.largura) {
        perfilConverted.constructive.cement_pad = {
          type: perfilImported.construtivo.laje.tipo,
          thickness: parseFloat(perfilImported.construtivo.laje.espessura),
          width: parseFloat(perfilImported.construtivo.laje.largura),
          length: parseFloat(perfilImported.construtivo.laje.comprimento),
        };
      }

      perfilImported = { ...perfilConverted };
    } else {
      throw new Error('Perfil inválido');
    }
  }

  return perfilImported;
};
