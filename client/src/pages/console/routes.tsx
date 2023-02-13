import React from 'react';
/* eslint-disable implicit-arrow-linebreak */
import { useRouteMatch, Route, Switch, Redirect } from 'react-router-dom';

import MainViewComponent from '../../components/mainViewComponent/mainView.component';

import MainMap from '../../components/maps/mainMap.component';
import MunicipiosComponent from '../../components/municipios/municipios.component';

import { ReactComponent as Water } from '../../assets/icons/main_categories_btn/Water.svg';
import { ReactComponent as WaterOutline } from '../../assets/icons/main_categories_btn/WaterOutline.svg';
import { ReactComponent as Documents } from '../../assets/icons/main_categories_btn/Documents.svg';
import { ReactComponent as DocumentsOutline } from '../../assets/icons/main_categories_btn/DocumentsOutline.svg';
// import { ReactComponent as Wrench } from '../../assets/icons/main_categories_btn/Wrench.svg';
// import { ReactComponent as WrenchOutline } from '../../assets/icons/main_categories_btn/WrenchOutline.svg';
// import { ReactComponent as Sewage } from '../../assets/icons/main_categories_btn/Sewage.svg';
// import { ReactComponent as SewageOutline } from '../../assets/icons/main_categories_btn/SewageOutline.svg';

import tablesBundler from '../../models/tablesBundler';

type routesCategoriesType = {
  name: string;
  path: string;
  innerRouter: (i: any) => JSX.Element;
  icons: {
    icon: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
      }
    >;
    iconActive: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
      }
    >;
  };
  subRoutes: {
    name: string;
    path: string;
    isMain?: boolean;
    lastMain?: boolean;
    component?: () => JSX.Element;
    tableName?: string;
  }[];
}[];

const routesCategories: routesCategoriesType = [
  {
    name: 'ÁGUA',
    path: '/agua',
    innerRouter: (i) => <InnerRouteSwitch index={i} />,
    icons: {
      icon: WaterOutline,
      iconActive: Water,
    },
    subRoutes: [
      {
        name: 'Mapa Principal',
        path: '/mapa',
        isMain: true,
        component: () => <MainMap tablesNames={[tablesBundler.sedes_setores.name]} />,
      },
      {
        name: 'Municípios',
        path: '/municipios',
        lastMain: true,
        component: () => <MunicipiosComponent />,
      },
      {
        name: tablesBundler.sedes_setores.label,
        path: `/${tablesBundler.sedes_setores.name}`,
        tableName: tablesBundler.sedes_setores.name,
      },
      {
        name: tablesBundler.pocos.label,
        path: `/${tablesBundler.pocos.name}`,
        tableName: tablesBundler.pocos.name,
      },
      {
        name: tablesBundler.cap_superf.label,
        path: `/${tablesBundler.cap_superf.name}`,
        tableName: tablesBundler.cap_superf.name,
      },
      {
        name: tablesBundler.reservatorios.label,
        path: `/${tablesBundler.reservatorios.name}`,
        tableName: tablesBundler.reservatorios.name,
      },
      {
        name: tablesBundler.etas.label,
        path: `/${tablesBundler.etas.name}`,
        tableName: tablesBundler.etas.name,
      },
    ],
  },
  {
    name: 'LICENCIAMENTO',
    path: '/licenciamento',
    icons: {
      icon: DocumentsOutline,
      iconActive: Documents,
    },
    innerRouter: (i) => <InnerRouteSwitch index={i} />,
    subRoutes: [
      {
        isMain: true,
        name: tablesBundler.outorgas.label,
        path: `/${tablesBundler.outorgas.name}`,
        tableName: tablesBundler.outorgas.name,
      },
      {
        name: tablesBundler.licencas.label,
        path: `/${tablesBundler.licencas.name}`,
        tableName: tablesBundler.licencas.name,
      },
      {
        name: tablesBundler.processos.label,
        path: `/${tablesBundler.processos.name}`,
        tableName: tablesBundler.processos.name,
      },
      {
        name: tablesBundler.notificacoes.label,
        path: `/${tablesBundler.notificacoes.name}`,
        tableName: tablesBundler.notificacoes.name,
      },
    ],
  },
];

const InnerRouteSwitch = ({ index }) => {
  const { path } = useRouteMatch();
  return (
    <div style={{ display: 'contents' }}>
      <Switch>
        {[
          ...routesCategories[index].subRoutes.map((subRoute) => {
            const getSubrouteSwither = () => {
              if (subRoute.component) return <subRoute.component />;

              if (subRoute.tableName) return <MainViewComponent tableName={subRoute.tableName} />;
            };
            return (
              <Route key={subRoute.path} path={path + subRoute.path}>
                {getSubrouteSwither}
              </Route>
            );
          }),
        ]}
        {routesCategories[index].subRoutes.map((subRoute) => {
          if (subRoute.isMain) {
            return (
              <Route exact path={routesCategories[index].path}>
                <Redirect to={`${routesCategories[index].path}${subRoute.path}`} />
              </Route>
            );
          }
          return '';
        })}
      </Switch>
    </div>
  );
};

export default routesCategories;
