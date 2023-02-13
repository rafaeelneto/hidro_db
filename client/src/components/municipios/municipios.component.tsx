import React, { useRef, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, Switch, Route, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListItem, List, Button, ButtonGroup } from '@material-ui/core';

import { Map, List as ListIcon } from 'react-feather';

import * as d3 from 'd3';

import LoadingComponent from '../loadingComponents/loading.component';

import { convert2GeoJson } from '../../utils/geoJsonConverter';

import enums from '../../models/enums';

import styles from './municipios.module.scss';

const MunicipioDetails = () => {
  // @ts-ignore
  const { id } = useParams();

  const GET_DATA = gql`
    query GET_MUNICIPIOS($id: bigint!) {
      municipios_by_pk(id: $id) {
        id
        nome
        cd_mun
        operado_empresa
        pocos {
          id
          nome
          pocos_situacao(order_by: { date: desc }, limit: 1) {
            situacao
          }
        }
        cap_supers {
          id
          nome
        }
        etas {
          id
          nome
          cap_tratamento_ms
        }

        reservatorios {
          id
          nome
          vol_util
        }
        outorgas {
          id
          num_outorga
          validade
        }
        licencas {
          id
          num_licen
          validade
        }
        processos {
          id
          num_processo
          data_entrada
          descricao
        }
      }
    }
  `;

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { id },
  });

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  const municipioData = data.municipios_by_pk;

  if (!municipioData.operado_empresa) {
    return (
      <div className={styles.detailsRoot}>
        <span className={styles.title}>{municipioData.nome}</span>
        <span className={styles.codMun}>Cod. IBGE: {municipioData.cd_mun}</span>
        <span className={styles.noInfoMsg}>Este municipio não é operado pela empresa</span>
      </div>
    );
  }

  return (
    <div className={styles.detailsRoot}>
      <span className={styles.title}>{municipioData.nome}</span>
      <span className={styles.codMun}>Cod. IBGE: {municipioData.cd_mun}</span>
      <div>
        {municipioData.pocos && municipioData.pocos.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Poços</span>
            <List className={styles.listUnidades}>
              {municipioData.pocos.map((poco) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/agua/pocos/${poco.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{poco.nome}</span>
                    <span className={styles.secundary}>
                      {poco.pocos_situacao[0]
                        ? enums.enum_situ_features.get(poco.pocos_situacao[0].situacao)
                        : ''}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.cap_supers && municipioData.cap_supers.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Captação Superficial</span>
            <List className={styles.listUnidades}>
              {municipioData.cap_supers.map((capSuperf) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/agua/cap_superf/${capSuperf.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{capSuperf.nome}</span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.reservatorios && municipioData.reservatorios.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Reservatórios</span>
            <List className={styles.listUnidades}>
              {municipioData.reservatorios.map((reservatorio) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/agua/reservatorios/${reservatorio.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{reservatorio.nome}</span>
                    <span className={styles.secundary}>Vol: {reservatorio.vol_util} m³</span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.etas && municipioData.etas.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Tratamento de Água</span>
            <List className={styles.listUnidades}>
              {municipioData.etas.map((eta) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/agua/reservatorios/${eta.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{eta.nome}</span>
                    <span className={styles.secundary}>
                      Capacidade de Tratamento: {eta.cap_tratamento_ms} m³/s
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.licencas && municipioData.licencas.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Licenças</span>
            <List className={styles.listUnidades}>
              {municipioData.licencas.map((licenca) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/licenciamento/licencas/${licenca.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{licenca.num_licen}</span>
                    <span className={styles.secundary}>
                      Validade: {format(new Date(licenca.validade), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.outorgas && municipioData.outorgas.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Outorgas</span>
            <List className={styles.listUnidades}>
              {municipioData.outorgas.map((outorga) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/licenciamento/outorgas/${outorga.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{outorga.num_outorga}</span>
                    <span className={styles.secundary}>
                      Validade: {format(new Date(outorga.validade), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        {municipioData.processos && municipioData.processos.length > 0 ? (
          <div className={styles.tableContainer}>
            <span className={styles.tableTitle}>Processos</span>
            <List className={styles.listUnidades}>
              {municipioData.processos.map((processo) => (
                <ListItem
                  className={styles.unidadeItem}
                  button
                  component={Link}
                  to={`/licenciamento/processos/${processo.id}`}
                >
                  <div className={styles.unidadeContainer}>
                    <span className={styles.primary}>{processo.num_processo}</span>
                    <span className={styles.secundary}>
                      Validade:{' '}
                      {format(new Date(processo.data_entrada), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <span className={styles.secundary}>{processo.descricao}</span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const MunicipiosInfo = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const [selectedMunicipio, setSelectedMunicipio] = useState<null | number>(null);

  const [mapViz, setMapViz] = useState(true);
  const [transformD3, setTransformD3] = useState<any | null>(null);

  const d3Container = useRef(null);
  const svgContainer = useRef(null);
  const MARGINS = { TOP: 30, RIGHT: 30, BOTTOM: 15, LEFT: 40 };
  const HEIGHT = 600 - MARGINS.TOP - MARGINS.BOTTOM;
  const WIDTH = 600 - MARGINS.LEFT - MARGINS.RIGHT;

  const GET_DATA = gql`
    query GET_MUNICIPIOS {
      municipios(order_by: { nome: asc }) {
        id
        nome
        geom
        operado_empresa
      }
    }
  `;

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, loading, error, refetch } = useQuery(GET_DATA);

  const handleChooseMunicipio = (id) => {
    history.push(`${match.url}/${id}`);
    setSelectedMunicipio(id);
  };

  const tooltip = d3.select('body').append('div').attr('class', styles.tooltip).style('opacity', 0);

  useEffect(() => {
    if (!mapViz) return;
    if (!(data && data.municipios)) return;

    function responsivefy(svg) {
      // container will be the DOM element
      // that the svg is appended to
      // we then measure the container
      // and find its aspect ratio
      const container = d3.select(svg.node().parentNode);

      const width = svg.style('width');
      const height = svg.style('height');

      // set viewBox attribute to the initial size
      // control scaling with preserveAspectRatio
      // resize svg on inital page load
      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);

      // add a listener so the chart will be resized
      // when the window resizes
      // multiple listeners for the same event type
      // requires a namespace, i.e., 'click.foo'
      // api docs: https://goo.gl/F3ZCFr
      d3.select(window).on('resize.' + container.attr('id'), resize);

      // this is the code that resizes the chart
      // it will be called on load
      // and in response to window resizes
      // gets the width of the container
      // and resizes the svg to fill it
      // while maintaining a consistent aspect ratio
      function resize() {
        const h = parseInt(container.style('height').slice(0, -2));
        const w = parseInt(container.style('width').slice(0, -2));

        svg.attr('width', w);
        svg.attr('height', h);
      }
    }

    const svg = d3
      .select(svgContainer.current)
      .attr('height', HEIGHT + MARGINS.TOP + MARGINS.BOTTOM)
      .attr('width', WIDTH + MARGINS.LEFT + MARGINS.RIGHT)
      .call(responsivefy);

    svg.selectAll('*').remove();

    const municipiosGroup = svg.append('g');

    // Join the FeatureCollection's features array to path elements
    const geoJsonData = convert2GeoJson(data.municipios);

    const projection = d3
      .geoMercator()
      .center([-52.638378, -4.590805])
      .scale([2200])
      .translate([WIDTH / 2, HEIGHT / 2]);

    const municipios = municipiosGroup.selectAll('path').data(geoJsonData.features);
    const path = d3.geoPath().projection(projection);

    municipios.exit().remove();

    municipios.style('fill', (d) => {
      if (d.properties.id === selectedMunicipio) {
        return '#ff9e2e';
      }
      if (d.properties.operado_empresa) {
        return '#0093a7';
      }
    });

    municipios
      .join('path')
      .attr('class', styles.municipio)
      .attr('d', path)
      .merge(municipios)
      .style('fill', (d) => {
        if (d.properties.id === selectedMunicipio) {
          return '#ff9e2e';
        }
        if (d.properties.operado_empresa) {
          return '#0093a7';
        }
      })
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(`<span>${d.properties.nome}</span>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0).attr('display', 'hidden');
      })
      .on('click', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0);
        d3.selectAll(`.${styles.tooltip}`).remove();
        handleChooseMunicipio(d.properties.id);
      });

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .on('zoom', (event, d) => {
        municipiosGroup.selectAll('path').attr('transform', event.transform);
        tooltip.transition().duration(200).style('opacity', 0).attr('display', 'hidden');

        setTransformD3(event.transform);
      });

    if (transformD3) {
      municipiosGroup.selectAll('path').attr('transform', transformD3);
    }

    svg.call(zoom);
  }, [d3Container.current, data, mapViz, selectedMunicipio]);

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  return (
    <div className={styles.root}>
      <span className={styles.title}>Municípios</span>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <ButtonGroup className={styles.btnNav} disableElevation color="primary" size="small">
            <Button variant={mapViz ? 'contained' : undefined} onClick={() => setMapViz(true)}>
              Mapa
            </Button>
            <Button variant={!mapViz ? 'contained' : undefined} onClick={() => setMapViz(false)}>
              Lista
            </Button>
          </ButtonGroup>
          {mapViz ? (
            <div className={`${styles.optionsContainer} ${styles.d3Container}`} ref={d3Container}>
              <svg ref={svgContainer} />
            </div>
          ) : (
            <List className={`${styles.optionsContainer} ${styles.list}`}>
              {data.municipios.map((municipio) => {
                if (!municipio.nome) return '';
                return (
                  <ListItem button onClick={() => handleChooseMunicipio(municipio.id)}>
                    <span
                      className={` ${styles.municipioItem} ${
                        municipio.operado_empresa ? styles.municipioItemOperado : ''
                      } ${municipio.id === selectedMunicipio ? styles.municipioItemSelected : ''}`}
                    >
                      {municipio.nome}
                    </span>
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>

        <Switch>
          <Route path="/agua/municipios/:id">
            <div className={styles.detailsContainer}>
              <MunicipioDetails />
            </div>
          </Route>
          <Route path="/agua/municipios/">
            <div className={styles.detailsContainer}>
              <span className={styles.noInfoMsg}>Selecione um municipio para ver os detalhes</span>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default MunicipiosInfo;
