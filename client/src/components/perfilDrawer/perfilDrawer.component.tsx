import React, { useEffect, useRef, useState } from 'react';

import { Snackbar, Slider } from '@material-ui/core';

import * as d3module from 'd3';
import d3tip from 'd3-tip';

// @ts-ignore
import textures from 'textures';

import fdgcTextures from '../../utils/fgdcTextures';

import { APIPost, API_ENDPOINTS } from '../../utils/fetchRestful';

import {
  GEOLOGIC_COMPONENT_TYPE,
  BORE_HOLE_COMPONENT_TYPE,
  CEMENT_PAD_COMPONENT_TYPE,
  HOLE_FILL_COMPONENT_TYPE,
  PROFILE_TYPE,
  SURFACE_CASE_COMPONENT_TYPE,
  WELL_CASE_COMPONENT_TYPE,
  WELL_SCREEN_COMPONENT_TYPE,
  CONSTRUCTIVE_COMPONENT_TYPE,
} from '../../types/perfil.types';

import profileConverter from '../../utils/profileConverter';

import styles from './perfilDrawer.module.scss';

const d3 = {
  ...d3module,
  tip: d3tip,
};

type PDProps = {
  perfil: PROFILE_TYPE;
  withZoom?: boolean;
};

const getLithologicalFill = (data) => {
  const profileTextures: (number | string)[] = [];
  data.forEach((element) => {
    const texture: number | string = element.fgdc_texture;
    if (profileTextures.indexOf(texture) < 0) {
      profileTextures.push(texture);
    }
  });

  const litologicalFill = {};
  const texturesLoaded = {};

  profileTextures.forEach((textureCode) => {
    if (fdgcTextures[textureCode]) {
      texturesLoaded[textureCode] = fdgcTextures[textureCode];
    }
  });

  data.forEach((d) => {
    litologicalFill[`${d.fgdc_texture}.${d.from}`] = textures
      .paths()
      .d((s) => texturesLoaded[d.fgdc_texture])
      .size(150)
      .strokeWidth(0.8)
      .stroke('#303030')
      .background(d.color);
  });
  return litologicalFill;
};

const PerfilDrawer = ({ perfil, withZoom = true }: PDProps) => {
  const svgContainer = useRef(null);

  let profile = perfil;
  try {
    profile = profileConverter(perfil);
  } catch (e) {}

  const [firstRender, setFirstRender] = useState(true);

  const MARGINS = { TOP: 30, RIGHT: 30, BOTTOM: 15, LEFT: 50 };
  const HEIGHT = 800 - MARGINS.TOP - MARGINS.BOTTOM;
  const WIDTH = 200 - MARGINS.LEFT - MARGINS.RIGHT;

  const tooltip = d3.select('body').append('div').attr('class', styles.tooltip).style('opacity', 0);

  const showTooltip = (event, d: any, html: string) => {
    tooltip.transition().duration(200).style('opacity', 1);
    tooltip
      .html(html)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`);
  };

  const hideTooltip = (event, d: any) => {
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0)
      .attr('display', 'hidden')
      .attr('visibility', 'hidden');
  };

  const setSVGContainer = () => {
    if (!svgContainer.current) return;

    const svg = d3.select(svgContainer.current);

    svg.selectAll('*').remove();

    const pocoGroup = svg.append('g').attr('class', 'poco-group');

    const litoligicalGroup = pocoGroup.append('g').attr('class', 'lito-group');

    const constructionGroup = pocoGroup.append('g').attr('class', 'const-group');

    litoligicalGroup.append('g').attr('class', styles.yAxis);

    const cementPadGroup = constructionGroup.append('g').attr('class', 'cement-pad');
    const holeGroup = constructionGroup.append('g').attr('class', 'hole');
    const surfaceCaseGroup = constructionGroup.append('g').attr('class', 'surface-case');
    const holeFillGroup = constructionGroup.append('g').attr('class', 'hole-fill');
    const wellCaseGroup = constructionGroup.append('g').attr('class', 'well-case');
    const wellScreenGroup = constructionGroup.append('g').attr('class', 'well-screen');

    drawLog();
  };

  const drawLog = () => {
    if (!svgContainer.current) return;
    if (!profile.constructive || !profile.geologic) return;

    const noPerfil =
      profile.geologic.length === 0 &&
      profile.constructive.bole_hole.length === 0 &&
      profile.constructive.hole_fill.length === 0 &&
      profile.constructive.well_case.length === 0 &&
      profile.constructive.well_screen.length === 0;

    if (noPerfil) return;

    const profileTexture = {
      pad: textures.lines().heavier(10).thinner(1.5).background('#ffffff'),
      seal: textures.lines().thicker().background('#ffffff'),
      gravel_pack: textures.circles().complement().background('#ffffff'),
      well_screen: textures
        .paths()
        .d((s) => `M ${s / 4} ${s / 4} l ${s / 2} 0 `)
        .size(40)
        .strokeWidth(2)
        .thicker(2)
        .background('#fff'),
    };

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

    const pocoGroup = svg.select('.poco-group');

    const litoligicalGroup = svg
      .select('.lito-group')
      .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

    const constructionGroup = svg
      .select('.const-group')
      .attr('transform', `translate(${MARGINS.LEFT + WIDTH / 2}, ${MARGINS.TOP})`);

    const cementPadGroup = constructionGroup.select('.cement-pad');
    const holeGroup = constructionGroup.select('.hole');
    const surfaceCaseGroup = constructionGroup.select('.surface-case');
    const holeFillGroup = constructionGroup.select('.hole-fill');
    const wellCaseGroup = constructionGroup.select('.well-case');
    const wellScreenGroup = constructionGroup.select('.well-screen');

    const svgWidth: any = d3.select(svgContainer.current).attr('width');
    const svgHeight: any = d3.select(svgContainer.current).attr('height');

    const POCO_WIDTH = svgWidth / 4;
    const POCO_CENTER = (svgWidth * 3) / 4;

    const transition = d3.transition().duration(750).ease(d3.easeCubic);

    const updateGeology = async (data: GEOLOGIC_COMPONENT_TYPE[], yScale) => {
      const tipGeology = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html(
          (_element, d) => `
              <span class="${styles.title}">Litologia</span>
              <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
              <span class="${styles.secondaryInfo}"><strong>Descrição:</strong> ${d.description}</span>
          `,
        );

      svg.call(tipGeology);

      const litologicalFill = getLithologicalFill(data);

      const rects = litoligicalGroup.selectAll('rect').data(data);

      rects.exit().remove();

      const newLayers = rects
        .enter()
        .append('rect')
        .attr('x', POCO_CENTER)
        .attr('x', 10)
        .attr('width', POCO_CENTER)
        .style('stroke', '#101010')
        .style('stroke-width', '1px')
        .on('mouseover', tipGeology.show)
        .on('mouseout', tipGeology.hide);

      newLayers
        // @ts-ignore
        .merge(rects)

        .attr('y', (d: GEOLOGIC_COMPONENT_TYPE, i) => {
          if (i === 0) return yScale(d.from);
          return yScale(data[i - 1].to);
        })
        // @ts-ignore
        .transition(transition)
        .attr('height', (d: GEOLOGIC_COMPONENT_TYPE, i) => yScale(d.to - d.from))
        .style('fill', (d: GEOLOGIC_COMPONENT_TYPE) => {
          if (!litologicalFill[`${d.fgdc_texture}.${d.from}`].url) {
            return litologicalFill[`${d.fgdc_texture}.${d.from}`];
          }
          svg.call(litologicalFill[`${d.fgdc_texture}.${d.from}`]);
          return litologicalFill[`${d.fgdc_texture}.${d.from}`].url();
        });
    };

    const updatePoco = (data: CONSTRUCTIVE_COMPONENT_TYPE, yScale) => {
      const maxXValues = [
        ...data.bole_hole.map(
          (d: BORE_HOLE_COMPONENT_TYPE) =>
            // @ts-ignore
            // eslint-disable-next-line implicit-arrow-linebreak
            parseFloat(d.diam_pol),
          // eslint-disable-next-line function-paren-newline
        ),
        // @ts-ignore
        ...data.hole_fill.map((d: HOLE_FILL_COMPONENT_TYPE) => parseFloat(d.diam_pol)),
        // @ts-ignore
        ...data.well_screen.map((d: WELL_SCREEN_COMPONENT_TYPE) => parseFloat(d.diam_pol)),
        // @ts-ignore
        ...data.well_case.map((d: WELL_CASE_COMPONENT_TYPE) => parseFloat(d.diam_pol)),
      ];

      const maxValues = d3.max(maxXValues) || 0;

      const xScale = d3.scaleLinear().domain([0, maxValues]).range([0, POCO_WIDTH]);

      constructionGroup.selectAll('.cement_pad').remove();

      if (data.cement_pad && data.cement_pad.thickness) {
        const tipCP = d3
          .tip()
          .attr('class', styles.tooltip)
          .direction('e')
          .html(
            (element, d) => `
            <span class="${styles.title}">LAJE DE PROTEÇÃO</span>
            <span class="${styles.primaryInfo}">${data.cement_pad.type}</span>
            <span class="${styles.secondaryInfo}"><strong>Espessura:</strong> 
            ${data.cement_pad.thickness} m</span>
            <span class="${styles.secondaryInfo}"><strong>Largura:</strong> ${data.cement_pad.width} m</span>
            <span class="${styles.secondaryInfo}"><strong>Comprimento:</strong> ${data.cement_pad.length} m</span>
          `,
          );

        svg.call(tipCP);

        const cementPad = cementPadGroup.selectAll('rect').data([data.cement_pad]);

        cementPad.exit().remove();

        const newCementPad = cementPad
          .enter()
          .append('rect')
          .attr('class', 'cement_pad')
          .attr('x', (POCO_CENTER - (POCO_WIDTH + 40)) / 2)
          .attr('y', (d: any) => yScale(0) - yScale(d.thickness * 4))
          .attr('width', POCO_WIDTH + 40)
          .attr('height', (d: any) => yScale(d.thickness * 4))
          .style('fill', (d) => {
            svg.call(profileTexture.pad);
            return profileTexture.pad.url();
          })
          .style('stroke', '#303030')
          .style('stroke-width', '2px');

        newCementPad.on('mouseover', tipCP.show).on('mouseout', tipCP.hide);
      }

      const tipHole = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html(
          (element, d) => `
          <span class="${styles.title}">FURO</span>
          <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
          <span class="${styles.secondaryInfo}"><strong>Diâmetro:</strong>${d.diam_pol}"</span>
          `,
        );

      svg.call(tipHole);

      const hole = holeGroup.selectAll('rect').data(data.bole_hole);

      hole.exit().remove();

      const newHole = hole
        .enter()
        .append('rect')
        .style('fill', '#fff')
        .style('opacity', '0.6')
        .style('stroke', '#303030')
        .style('stroke-width', '1px')
        .on('mouseover', tipHole.show)
        .on('mouseout', tipHole.hide);

      newHole
        // @ts-ignore
        .merge(hole)
        .attr('x', (d: any) => (POCO_CENTER - xScale(d.diam_pol)) / 2)
        .attr('width', (d: any) => xScale(d.diam_pol))
        // @ts-ignore
        .transition(transition)
        .attr('y', (d: any, i) => {
          if (i === 0) return yScale(d.from);
          return yScale(data.bole_hole[i - 1].to);
        })
        .attr('height', (d: any) => yScale(d.to - d.from));

      const tipSC = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html((element, d) => {
          return `
            <span class="${styles.title}">TUBO DE BOCA</span>
            <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
            <span class="${styles.secondaryInfo}"><strong>Diâmetro:</strong>${d.diam_pol}"</span>
          `;
        });

      svg.call(tipSC);

      const surfaceCase = surfaceCaseGroup.selectAll('rect').data(data.surface_case);

      surfaceCase
        .exit()
        // @ts-ignore
        .transition(transition)
        .attr('height', 0)
        .style('fill', '#000')
        .remove();

      const newSurfaceCase = surfaceCase
        .enter()
        .append('rect')
        .style('fill', '#000')
        .on('mouseover', tipSC.show)
        .on('mouseout', tipSC.hide);

      newSurfaceCase
        // @ts-ignore
        .merge(surfaceCase)
        .attr('x', (d: any) => (POCO_CENTER - xScale(d.diam_pol)) / 2)
        .attr('width', (d: any) => xScale(d.diam_pol))
        // @ts-ignore
        .transition(transition)
        .attr('y', (d: any, i) => {
          if (i === 0) return yScale(d.from);
          return yScale(data.surface_case[i - 1].to);
        })
        .attr('height', (d: any) => yScale(d.to - d.from));

      const tipHoleFill = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html((element, d) => {
          return `
          <span class="${styles.title}">ESP. ANELAR</span>
          <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
          <span class="${styles.secondaryInfo}"><strong>Diâmetro:</strong>${d.diam_pol}"</span>
          <span class="${styles.secondaryInfo}"><strong>Descrição:</strong> ${d.description}</span>
          `;
        });

      svg.call(tipHoleFill);

      const holeFill = holeFillGroup.selectAll('rect').data(data.hole_fill);

      holeFill.exit().remove();

      const newHoleFill = holeFill
        .enter()
        .append('rect')
        .style('stroke', '#303030')
        .style('stroke-width', '2px')
        .on('mouseover', tipHoleFill.show)
        .on('mouseout', tipHoleFill.hide);

      newHoleFill
        // @ts-ignore
        .merge(holeFill)
        .attr('x', (d: any) => (POCO_CENTER - xScale(d.diam_pol)) / 2)
        .attr('width', (d: any) => xScale(d.diam_pol))
        // @ts-ignore
        .transition(transition)
        .attr('y', (d: any, i) => {
          if (i === 0) return yScale(d.from);
          return yScale(data.hole_fill[i - 1].to);
        })
        .attr('height', (d: any) => yScale(d.to - d.from))
        .style('fill', (d: HOLE_FILL_COMPONENT_TYPE) => {
          svg.call(profileTexture[d.type]);
          return profileTexture[d.type].url();
        });

      const tipWellCase = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html((element, d) => {
          return `
          <span class="${styles.title}">REVESTIMENTO</span>
              <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
              <span class="${styles.secondaryInfo}"><strong>Diâmetro:</strong> ${d.diam_pol}"</span>
              <span class="${styles.secondaryInfo}"><strong>Tipo:</strong> ${d.tipo}</span>
          `;
        });

      svg.call(tipWellCase);

      const wellCase = wellCaseGroup.selectAll('rect').data(data.well_case);

      wellCase.exit().remove();

      const newWellCase = wellCase
        .enter()
        .append('rect')
        .style('fill', '#fff')
        .style('stroke', '#303030')
        .style('stroke-width', '2px')
        .on('mouseover', tipWellCase.show)
        .on('mouseout', tipWellCase.hide);

      newWellCase
        // @ts-ignore
        .merge(wellCase)
        .attr('x', (d: any) => (POCO_CENTER - xScale(d.diam_pol)) / 2)
        .attr('width', (d: any) => xScale(d.diam_pol))
        // @ts-ignore
        .transition(transition)
        .attr('y', (d: any, i) => {
          if (i === 0) return yScale(d.from);
          return yScale(d.from);
        })
        .attr('height', (d: any, i) => {
          if (i === 0) return yScale(d.to - d.from);
          return yScale(d.to - d.from);
        });

      const tipWellScreen = d3
        .tip()
        .attr('class', styles.tooltip)
        .direction('e')
        .html((element, d) => {
          return `
          <span class="${styles.title}">FILTROS</span>
              <span class="${styles.primaryInfo}">De ${d.from} m até ${d.to} m</span>
              <span class="${styles.secondaryInfo}"><strong>Diâmetro:</strong> ${d.diam_pol}"</span>
              <span class="${styles.secondaryInfo}"><strong>Tipo:</strong> ${d.tipo}</span>
              <span class="${styles.secondaryInfo}"><strong>Ranhura:</strong> ${d.ranhura_mm}mm</span>
          `;
        });

      svg.call(tipWellScreen);

      const wellScreen = wellScreenGroup.selectAll('rect').data(data.well_screen);

      wellScreen.exit().remove();

      const newWellScreen = wellScreen
        .enter()
        .append('rect')
        .style('stroke', '#303030')
        .style('stroke-width', '2px')
        .style('fill', (d: any) => {
          svg.call(profileTexture.well_screen);
          return profileTexture.well_screen.url();
        })
        .on('mouseover', tipWellScreen.show)
        .on('mouseout', tipWellScreen.hide);

      newWellScreen
        // @ts-ignore
        .merge(wellScreen)
        .attr('x', (d: any) => (POCO_CENTER - xScale(d.diam_pol)) / 2)
        .attr('width', (d: any) => xScale(d.diam_pol))
        // @ts-ignore
        .transition(transition)
        .attr('y', (d: any, i) => {
          return yScale(d.from);
        })
        .attr('height', (d: any) => yScale(d.to - d.from));
    };

    const geologicData = profile.geologic;
    const constructionData = profile.constructive;

    const maxValues = [
      geologicData.length === 0 ? 0 : geologicData[geologicData.length - 1].to,
      constructionData.bole_hole.length === 0
        ? 0
        : constructionData.bole_hole[constructionData.bole_hole.length - 1].to,
      constructionData.hole_fill.length === 0
        ? 0
        : constructionData.hole_fill[constructionData.hole_fill.length - 1].to,
      constructionData.well_case.length === 0
        ? 0
        : constructionData.well_case[constructionData.well_case.length - 1].to,
      constructionData.well_screen.length === 0
        ? 0
        : constructionData.well_screen[constructionData.well_screen.length - 1].to,
    ];

    const maxYValues = d3.max(maxValues) || 0;

    const yScaleGlobal = d3
      .scaleLinear()
      .domain([0, maxYValues])
      .range([0, svgHeight - MARGINS.TOP - MARGINS.BOTTOM]);

    const yAxis = d3.axisLeft(yScaleGlobal).tickFormat((d: any) => `${d} m`);

    // @ts-ignore
    const gY = litoligicalGroup.select(`.${styles.yAxis}`).call(yAxis);

    const spanY = (d) => {
      if (d.thickness) return yScaleGlobal(0) - yScaleGlobal(d.thickness * 4);
      return yScaleGlobal(d.from);
    };

    const spanH = (d) => {
      if (d.thickness) return yScaleGlobal(d.thickness * 4);
      return yScaleGlobal(d.to - d.from);
    };

    if (withZoom) {
      // @ts-ignore
      const zoom = d3
        .zoom()
        .scaleExtent([0.2, 5])
        .on('zoom', (e) => {
          // eslint-disable-next-line prefer-destructuring
          const transform = e.transform;

          // @ts-ignore
          gY.call(yAxis.scale(transform.rescaleY(yScaleGlobal)));
          pocoGroup
            .selectAll('rect')
            .attr('y', (d) => {
              if (!d) return null;
              return transform.applyY(spanY(d));
            })
            .attr('height', (d) => {
              if (!d) return null;
              return transform.k * spanH(d);
            });
        });
      svg.call(zoom);
    }

    drawProfile();

    // @ts-ignore

    function drawProfile() {
      if (geologicData) updateGeology(geologicData, yScaleGlobal);
      if (constructionData) updatePoco(constructionData, yScaleGlobal);
    }
  };

  useEffect(() => {
    setSVGContainer();
  }, [svgContainer.current]);

  useEffect(() => {
    // console.log(d3.select(svgContainer.current));

    drawLog();
  }, [profile, svgContainer.current]);

  let noPerfil = true;
  if (profile.geologic && profile.constructive) {
    noPerfil =
      profile.geologic.length === 0 &&
      profile.constructive.bole_hole.length === 0 &&
      profile.constructive.hole_fill.length === 0 &&
      profile.constructive.well_case.length === 0 &&
      profile.constructive.well_screen.length === 0;
  }
  return (
    <>
      {noPerfil ? <span className={styles.noFilesMsg}>Perfil não configurado</span> : ''}
      <svg className={`${styles.svgContainer}`} ref={svgContainer} />
    </>
  );
};

export default PerfilDrawer;
