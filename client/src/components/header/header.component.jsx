import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable no-nested-ternary */
import {
  Button,
  IconButton,
  useTheme,
  makeStyles,
  Box,
  Paper,
  InputBase,
  Popper,
  ClickAwayListener,
  Grow,
  MenuList,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@material-ui/core/';

import { ChevronsLeft, XCircle, Info } from 'react-feather';

import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';

import tableNames from '../../models/tablesDefs/tablesNames';

import CollapseSide from '../../themes/CollapseSide';

import LoadingComponent from '../loadingComponents/loading.component';

import { ReactComponent as LogoHeader } from '../../assets/logos/logo_hidro_db_wbg.svg';
import { ReactComponent as LabelHeader } from '../../assets/logos/logo_hidro_db_label_horizontal_wbg.svg';

import { logout } from '../../utils/authetication';

import { sideBarHiddenVar, userInfoVar } from '../../graphql/cache';

import styles from './header.module.scss';

const LABEL_SIZE = '150px';

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '45px',
    padding: '0 5px 0 5px',
  },
  label: {
    width: '120px',
    padding: '5px',
  },
  collapseBtn: {
    transition: `transform ${300}ms ease-in-out`,
    '& .logo': {
      '& path': {
        fill: `${theme.palette.primary.light} !important`,
      },
      height: '15px',
      width: 'auto',
    },
  },
  collapseBtnRotate: {
    transform: 'rotate(180deg)',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginLeft: 'auto',
  },
  userNameBtn: {
    color: theme.palette.grayNeutral,
    fontWeight: '400',
    fontSize: '12pt',
    textTransform: 'none',
    letterSpacing: '1px',
  },
}));

const GET_USER_NAME = gql`
  query user($id: uuid!) {
    users_by_pk(id: $id) {
      nome
    }
  }
`;

const SEARCH_QUERY = gql`
  query ($term: String) {
    global_search(args: { searchterm: $term }) {
      id
      description
      label
      source_table
    }
  }
`;

const UserInfo = ({ mobileView }) => {
  const history = useHistory();
  const { id: userId } = userInfoVar();

  const { data, loading, error } = useQuery(GET_USER_NAME, {
    variables: { id: userId },
  });

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  if (loading) {
    return (
      <div className={styles.userInfo}>
        <LoadingComponent />
      </div>
    );
  }
  if (error) {
    throw error;
  }

  const {
    users_by_pk: { nome },
  } = data;

  return (
    <div className={styles.userInfo}>
      {!mobileView ? (
        <IconButton
          className={styles.cleanSearchBtn}
          onClick={() => {
            history.push('/sobre/');
          }}
        >
          <Info className="logo" />
        </IconButton>
      ) : (
        ''
      )}

      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className={styles.userNameBtn}
        >
          {nome}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          placement="bottom-end"
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem
                      onClick={() => {
                        history.push('/configuracoes/');
                        setOpen(false);
                      }}
                    >
                      Configurações
                    </MenuItem>
                    {mobileView ? (
                      <MenuItem
                        onClick={() => {
                          history.push('/sobre/');
                          setOpen(false);
                        }}
                      >
                        Sobre
                      </MenuItem>
                    ) : (
                      ''
                    )}

                    <MenuItem
                      onClick={() => {
                        logout().then(() => history.push('/login'));
                        setOpen(false);
                      }}
                    >
                      Sair
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

const Header = ({ mobileView }) => {
  const history = useHistory();
  // CONFIGURING THEME AND STYLES
  const theme = useTheme();
  const classes = useStyles(theme);

  // use query makes the react update the ui on the Var() change
  const sidebarHidden = sideBarHiddenVar();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [search, { data: searchData }] = useLazyQuery(SEARCH_QUERY);

  const onSearchInput = ({ target }) => {
    setSearchTerm(target.value);
    if (!target.value) return;
    search({
      variables: {
        term: target.value,
      },
    });

    setSearchLoading(true);
  };

  if (searchData && searchLoading) {
    setSearchResults(searchData.global_search);

    setSearchLoading(false);
  }

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  const moveUp = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const moveDown = () => {
    if (currentIndex < searchResults.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onKeyPressed = (e) => {
    // if (e.key === 'ArrowUp') {
    //   // up arrow
    //   moveUp();
    // } else if (e.key === 'ArrowDown') {
    //   // down arrow
    //   moveDown();
    // }

    if (e.keyCode === 27) {
      clearSearch();
    }
  };

  document.addEventListener('keydown', onKeyPressed);

  return (
    <Box className={styles.root} boxShadow={2} zIndex="tooltip">
      <Link to="/">
        <LogoHeader className={classes.logo} />
      </Link>

      {!mobileView ? (
        <>
          <CollapseSide in={!sidebarHidden} size={LABEL_SIZE}>
            <div className={classes.label}>
              <Link to="/">
                <LabelHeader />
              </Link>
            </div>
          </CollapseSide>
          <IconButton
            className={`${classes.collapseBtn} ${sidebarHidden ? classes.collapseBtnRotate : ''}`}
            onClick={() => {
              sideBarHiddenVar(!sidebarHidden);
            }}
          >
            <ChevronsLeft className="logo" />
          </IconButton>
        </>
      ) : (
        ''
      )}

      <div className={styles.searchContainer}>
        <InputBase
          value={searchTerm}
          className={`${styles.searchInput}`}
          placeholder={mobileView ? 'Procure no Hidro-db' : 'Procure dentro do Hidro-db'}
          inputProps={{ 'aria-label': 'search' }}
          onChange={onSearchInput}
        />
        {searchTerm !== '' ? (
          <IconButton
            className={styles.cleanSearchBtn}
            onClick={() => {
              clearSearch();
            }}
          >
            <XCircle className="logo" />
          </IconButton>
        ) : (
          ''
        )}

        <Box boxShadow={3} className={`${styles.listContainer} ${searchTerm ? styles.active : ''}`}>
          <List dense>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((result) => {
                const { id, description, label, source_table: sourceTable } = result;
                const link = tableNames[sourceTable]?.getLink(id);
                const tableLabel = tableNames[sourceTable]?.label;
                return (
                  <ListItem
                    className={`${styles.listItem}`}
                    key={id}
                    button
                    onClick={() => {
                      clearSearch();
                      history.push(link);
                    }}
                  >
                    <ListItemText primary={label} secondary={description} />
                    <div className={styles.tableLabel}>{tableLabel}</div>
                  </ListItem>
                );
              })
            ) : searchLoading ? (
              <LinearProgress />
            ) : (
              <span className={styles.noFilesMsg}>Não foram encontrados resultados</span>
            )}
          </List>
        </Box>
      </div>
      <UserInfo mobileView={mobileView} />
    </Box>
  );
};

export default Header;
